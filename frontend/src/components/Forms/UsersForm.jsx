import {
  CardActions,
  Typography,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdateUser, useForgotPassword, useUsers } from "@queries/data";
import Notification from "@helpers/Notification";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function UserForm({ user }) {
  const [message, setMessage] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...user,
      super_user: !!user?.super_user,
      disabled: !!user?.disabled,
    },
  });

  const updateUser = useUpdateUser();
  const passwordReset = useForgotPassword();

  const handlePasswordReset = () => {
    setNotificationStatus("loading");
    passwordReset.mutate(
      { data: { email: user?.email } },
      {
        onSuccess: (data) => {
          setMessage("User email with password reset link sent!");
          setNotificationStatus("success");
        },
        onError: (error) => {
          setMessage(
            error?.response?.data?.detail || "Failed to reset password"
          );
          setNotificationStatus("error");
        },
      }
    );
  };

  const onSubmit = (data) => {
    setNotificationStatus("loading");
    updateUser.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("User information updated successfully!");
          setNotificationStatus("success");
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail || "Failed to update user");
          setNotificationStatus("error");
        },
      }
    );
  };

  const handleResetForm = () => reset(user);
  const disableForm = passwordReset.isPending || updateUser.isPending;

  return (
    <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1, borderRadius: 1 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.username}
            </Typography>
            <Stack direction="row" spacing={1}>
              <FormControlLabel
                disabled={disableForm}
                control={<Checkbox {...register("super_user")} />}
                label="Admin"
              />
              <FormControlLabel
                disabled={disableForm}
                control={<Checkbox {...register("disabled")} />}
                label="Disabled"
              />
            </Stack>
          </Stack>

          {/* Notification */}
          {(notificationStatus === "success" ||
            notificationStatus === "error") && (
            <Notification
              requestStatus={notificationStatus}
              message={message}
            />
          )}

          <Stack direction="row" spacing={2}>
            <TextField
              disabled={disableForm}
              label="First Name"
              fullWidth
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message || ""}
            />
            <TextField
              disabled={disableForm}
              label="Last Name"
              fullWidth
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message || ""}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Username"
              fullWidth
              disabled
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message || ""}
            />
            <TextField
              disabled={true}
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message || ""}
            />
          </Stack>

          <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetForm}
              disabled={disableForm}
            >
              Reset Form
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handlePasswordReset}
              endIcon={<RestartAltIcon />}
              disabled={disableForm}
            >
              {passwordReset.isLoading ? "Resetting..." : "Reset Password"}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={disableForm}
              sx={{ backgroundColor: "#20477B" }}
            >
              {updateUser.isLoading ? "Saving..." : "Save"}
            </Button>
          </CardActions>
        </Stack>
      </form>
    </Paper>
  );
}

export default function UsersPanelForm() {
  const { user } = useAuth();
  const users = useUsers();
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  return (
    user && (
      <Dialog onClose={handleClose} open={true} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Users
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{ maxHeight: "80vh", overflowY: "auto", p: 2 }}
        >
          <Stack direction="column" spacing={2}>
            {users?.data?.data?.map((u) => (
              <UserForm key={u?.id} user={u} />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    )
  );
}
