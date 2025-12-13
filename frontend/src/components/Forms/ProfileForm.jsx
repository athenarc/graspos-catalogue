import { useForm } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUpdateUser } from "@queries/data";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "@helpers/Notification";
import { useAuth } from "../AuthContext";

export default function ProfileForm() {
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const form = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const navigate = useNavigate();
  const updateUser = useUpdateUser();

  const onSubmit = (data) => {
    updateUser.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("User information updated successfully!");
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
        },
      }
    );
  };

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  function handleClose() {
    navigate("..");
  }

  return (
    user && (
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
          My profile
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
          <Stack direction="column" spacing={2}>
            <TextField
              required
              {...register("username", {
                value: user?.username,
              })}
              disabled
              label="Username"
              sx={{ width: "100%" }}
            />
            <TextField
              required
              {...register("email", {
                value: user?.email,
                disabled: true,
                required: "Email can not be empty",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid email address",
                },
              })}
              label="Email"
              error={!!errors?.email}
              helperText={errors?.email?.message}
              fullWidth
            />
            <TextField
              {...register("first_name", {
                value: user?.first_name,
              })}
              label="First Name"
              sx={{ width: "100%" }}
            />
            <TextField
              {...register("last_name", { value: user?.email })}
              label="Last Name"
              sx={{ width: "100%" }}
            />

            <TextField
              {...register("orcid", {
                pattern: {
                  value: /^(\d{4}-){3}\d{3}(\d|X)$/,
                  message: "Orcid not in correct format",
                },
              })}
              label="Orcid"
              fullWidth
              error={!!errors?.orcid}
              helperText={errors?.orcid?.message}
            />
            <TextField
              {...register("organization", {
                value: user?.organization,
              })}
              label="Organization"
              sx={{ width: "100%" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/profile/reset-password")}
            sx={{
              borderColor: "#20477B",
              color: "#20477B",
              "&:hover": {
                borderColor: "#16365E",
                backgroundColor: "#16365E",
                color: "white",
              },
            }}
          >
            Reset Password
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={updateUser.isPending}
            loading={updateUser.isPending}
            endIcon={<SaveIcon />}
            loadingPosition="end"
            sx={{ backgroundColor: "#20477B" }}
          >
            Save
          </Button>
        </DialogActions>
        {(updateUser?.isSuccess || updateUser?.isError) && (
          <Notification requestStatus={updateUser?.status} message={message} />
        )}
      </Dialog>
    )
  );
}
