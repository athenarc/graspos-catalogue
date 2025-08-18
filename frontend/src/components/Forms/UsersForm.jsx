import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdateUser, useUserResetPassword } from "../../queries/data";
import Notification from "@helpers/Notification";

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
  const passwordReset = useUserResetPassword();

  const handlePasswordReset = () => {
    setNotificationStatus("loading");
    passwordReset.mutate(
      { data: { id: user?.id } },
      {
        onSuccess: () => {
          setMessage("User password reset successfully!");
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
    <Card component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">{user?.username}</Typography>
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

          {/* Notification */}
          {(notificationStatus === "success" ||
            notificationStatus === "error") && (
            <Notification
              requestStatus={notificationStatus}
              message={message}
            />
          )}
        </Stack>

        <Stack spacing={2}>
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
              disabled={disableForm}
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message || ""}
            />
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", gap: 1, p: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          disabled={passwordReset.isPending || updateUser.isPending}
          onClick={handleResetForm}
        >
          Reset Form
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handlePasswordReset}
          endIcon={<RestartAltIcon />}
          disabled={passwordReset.isPending}
          loading={passwordReset.isPending}
        >
          {passwordReset.isLoading ? "Resetting..." : "Reset Password"}
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
      </CardActions>
    </Card>
  );
}

export default UserForm;
