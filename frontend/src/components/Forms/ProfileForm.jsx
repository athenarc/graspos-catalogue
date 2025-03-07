import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Table,
  TableRow,
  TableCell,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableHead,
  TableContainer,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "../../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "../Notification";

export default function ProfileForm() {
  const { user } = useOutletContext();

  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
    <>
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
            backgroundColor: "#338BCB",
            color: "white",
            textAlign: "center",
          }}
        >
          My Profile
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
        <DialogContent dividers sx={{ p: 2 }}>
          <TextField
            required
            {...register("email", {
              value: user?.email,
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
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogContent dividers sx={{ p: 2 }}>
          <TextField
            {...register("first_name", {
              value: user?.first_name,
            })}
            label="First Name"
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogContent dividers sx={{ p: 2 }}>
          <TextField
            {...register("last_name", { value: user?.email })}
            label="Last Name"
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogContent dividers sx={{ p: 2 }}>
          <TextField
            {...register("organization", {
              value: user?.organization,
            })}
            label="Organization"
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={updateUser.isLoading}
          >
            {updateUser.isLoading ? (
              <>
                Saving
                <CircularProgress size="13px" sx={{ ml: 1 }} />
              </>
            ) : (
              <>
                Save
                <SaveIcon sx={{ ml: 1 }} />
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {updateUser.isSuccess || updateUser.isError ? (
        <Notification requestStatus={updateUser?.status} message={message} />
      ) : (
        ""
      )}
    </>
  );
}
