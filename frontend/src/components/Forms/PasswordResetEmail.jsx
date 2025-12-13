import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  DialogTitle,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import AlertMessage from "@helpers/AlertMessage";
import AlertHelperText from "@helpers/AlertHelperText";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useForgotPassword } from "@queries/data";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordModal() {
  const [globalMessage, setGlobalMessage] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });

  const { mutate, isPending, isSuccess } = useForgotPassword();

  const onSubmit = (data) => {
    setGlobalMessage(null);
    mutate(
      { data },
      {
        onSuccess: (res) => {
          setGlobalMessage(
            "If an account exists with that email, a reset link has been sent."
          );
          setTimeout(() => {
            handleClose();
          }, 2000);
        },
        onError: (error) => {
          const err = error?.response?.data?.detail || "Something went wrong.";
          if (typeof err === "string") {
            setGlobalMessage(err);
          } else if (typeof err === "object") {
            Object.entries(err).forEach(([field, message]) => {
              setError(field, { type: "server", message });
            });
          } else {
            setGlobalMessage("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  const handleClose = () => {
    setError(null);
    setGlobalMessage(null);
    navigate("..");
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      onSubmit={handleSubmit(onSubmit)}
      component="form"
    >
      <DialogTitle
        sx={{
          backgroundColor: "#20477B",
          color: "white",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        Forgot Password
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {isPending ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Sending reset link...
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
              disabled={isPending || isSuccess}
              {...register("email", {
                required: "Email cannot be empty",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid email address",
                },
              })}
              label="Email"
              error={!!errors?.email}
              fullWidth
            />
            {!!errors?.email && <AlertHelperText error={errors?.email} />}

            {globalMessage && (
              <AlertMessage severity="info">{globalMessage}</AlertMessage>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending || isSuccess}
          endIcon={<MailOutlineIcon />}
          sx={{
            backgroundColor: "#20477B",
            "&:hover": { backgroundColor: "#16365E" },
          }}
          fullWidth
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
