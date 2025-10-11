import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUserResetPassword } from "@queries/data";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "@helpers/Notification";
import { useAuth } from "../AuthContext";
import Password from "./Fields/Password";
import AlertMessage from "../Helpers/AlertMessage";

export default function ResetPassword() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const form = useForm();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = form;
  const navigate = useNavigate();
  const resetPassword = useUserResetPassword();

  const onSubmit = (data) => {
    resetPassword.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("User password updated successfully!");
          handleClose();
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
          if (error?.response?.status === 403) {
            setError("password", {
              type: "manual",
              message: "Old password is incorrect",
            });
          }
          if (error?.response?.status === 400) {
            setError("new_password", {
              type: "manual",
              message: error?.response?.data?.detail,
            });
          }
        },
      }
    );
  };

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  function handleClose() {
    navigate(-1);
  }
  return (
    <Dialog
      component="form"
      onClose={handleClose}
      open={true}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: "#20477B",
          color: "white",
          textAlign: "center",
        }}
      >
        Update Password
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon sx={{ color: "white" }} />
      </IconButton>
      <DialogContent sx={{ p: 2 }}>
        <Password
          form={form}
          previousPassword={true}
          confirmPassword
          currentPasswordValidation={false}
          confirmPasswordRules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("new_password") || "Passwords do not match",
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={resetPassword?.isPending}
          loading={resetPassword?.isPending}
          endIcon={<SaveIcon />}
          loadingPosition="end"
          sx={{ backgroundColor: "#20477B" }}
        >
          Update Password
        </Button>
      </DialogActions>
      {(resetPassword?.isSuccess || resetPassword?.isError) && (
        <Notification requestStatus={resetPassword?.status} message={message} />
      )}
    </Dialog>
  );
}
