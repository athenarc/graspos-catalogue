import {
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import Notification from "@helpers/Notification";
import { useUpdateUser, useForgotPassword, useUsers } from "@queries/data";
import { useAuth } from "../AuthContext";
import LoadingComponent from "@helpers/LoadingComponent";
import CloseIcon from "@mui/icons-material/Close";

function UserForm({ user }) {
  const [open, setOpen] = useState(false);
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
      verified: !!user?.email_confirmed_at,
    },
  });

  const updateUser = useUpdateUser();
  const passwordReset = useForgotPassword();
  const disableForm = passwordReset.isPending || updateUser.isPending;

  const handlePasswordReset = () => {
    setNotificationStatus("loading");
    passwordReset.mutate(
      { data: { email: user?.email } },
      {
        onSuccess: () => {
          setMessage("Password reset email sent!");
          setNotificationStatus("success");
        },
        onError: (err) => {
          setMessage(err?.response?.data?.detail || "Failed to reset password");
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
          setMessage("User updated successfully!");
          setNotificationStatus("success");
        },
        onError: (err) => {
          setMessage(err?.response?.data?.detail || "Failed to update user");
          setNotificationStatus("error");
        },
      }
    );
  };

  const handleResetForm = () => reset(user);

  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <Stack spacing={1}>
        <CardContent
          sx={{
            cursor: "pointer",
            p: 2,
            bgcolor: "#f9fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "16px !important",
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {user?.username}
            </Typography>
            {user?.email_confirmed_at && (
              <Tooltip title="Email Verified">
                <VerifiedIcon sx={{ color: "#1e88e5", fontSize: 22 }} />
              </Tooltip>
            )}
          </Stack>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Admin privileges">
              <FormControlLabel
                label="Admin"
                control={
                  <Checkbox
                    {...register("super_user")}
                    disabled={disableForm}
                    color="primary"
                    checked={!!user?.super_user}
                  />
                }
              />
            </Tooltip>
            <Tooltip title="User disabled">
              <FormControlLabel
                label="Disabled"
                control={
                  <Checkbox
                    {...register("disabled")}
                    disabled={disableForm}
                    color="error"
                    checked={!!user?.disabled}
                  />
                }
              />
            </Tooltip>
          </Stack>
        </CardContent>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent sx={{ pt: 1, paddingBottom: "16px !important" }}>
              <Stack spacing={2}>
                {(notificationStatus === "success" ||
                  notificationStatus === "error") && (
                  <Notification
                    message={message}
                    requestStatus={notificationStatus}
                  />
                )}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...register("first_name")}
                    disabled={disableForm}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message || ""}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    {...register("last_name")}
                    disabled={disableForm}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message || ""}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Username"
                    {...register("username")}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    {...register("email")}
                    disabled
                  />
                </Stack>
              </Stack>
            </CardContent>

            <CardActions
              sx={{ justifyContent: "flex-end", gap: 1, pb: 2, px: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleResetForm}
                disabled={disableForm}
              >
                Reset Form
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handlePasswordReset}
                endIcon={
                  passwordReset.isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <RestartAltIcon />
                  )
                }
                disabled={disableForm}
              >
                {passwordReset.isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  updateUser.isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={disableForm}
                sx={{ backgroundColor: "#20477B" }}
              >
                {updateUser.isLoading ? "Saving..." : "Save"}
              </Button>
            </CardActions>
          </form>
        </Collapse>
      </Stack>
    </Card>
  );
}

export default function UsersPanelForm() {
  const { user } = useAuth();
  const users = useUsers();
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const handleClose = () => setOpen(false);

  // Φιλτράρει τη λίστα χρηστών ανά username
  const filteredUsers = useMemo(() => {
    if (!users?.data?.data) return [];
    return users.data.data.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    user && (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          Users
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {users?.isLoading && (
          <LoadingComponent loadingMessage="Loading users..." height="400px" />
        )}

        {users?.isSuccess && (
          <DialogContent
            dividers
            sx={{ maxHeight: "75vh", overflowY: "auto", p: 2 }}
          >
            <Stack direction="row" justifyContent="flex-start" mb={2}>
              {/* Search Input */}
              <TextField
                slotProps={{
                  input: {
                    style: {
                      borderRadius: "19px",
                      backgroundColor: "#fff",
                    },
                  },
                }}
                size="small"
                variant="outlined"
                placeholder="Search users by username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Stack>
            <Stack spacing={2}>
              {filteredUsers.map((u) => (
                <UserForm key={u?.id} user={u} />
              ))}
              {filteredUsers.length === 0 && (
                <Typography textAlign="center" color="text.secondary">
                  No users found.
                </Typography>
              )}
            </Stack>
          </DialogContent>
        )}
      </Dialog>
    )
  );
}
