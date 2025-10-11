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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage";
import AlertHelperText from "./AlertHelperText";

import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import { useResetPassword } from "../../queries/data";
import Password from "../Forms/Fields/Password";

export default function PasswordResetModal() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });

  const { mutate, isPending, isSuccess } = useResetPassword(token);

  const password = watch("password");
  const passwordConfirmation = watch("passwordConfirmation");

  // --- Live validation για password match ---
  useEffect(() => {
    if (!isSubmitted) return;
    if (passwordConfirmation && password !== passwordConfirmation) {
      setError("passwordConfirmation", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("passwordConfirmation");
    }
  }, [password, passwordConfirmation, setError, clearErrors, isSubmitted]);

  // --- Submit handler ---
  const onSubmit = (data) => {
    setGlobalError(null);
    data.token = token;
    mutate(
      { data },
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: (error) => {
          const err =
            error?.response?.data?.detail || "An unexpected error occurred.";

          if (typeof err === "string") {
            setGlobalError(err);
            return;
          }

          if (typeof err === "object") {
            Object.entries(err).forEach(([field, message]) => {
              setError(field, { type: "server", message });
            });
          } else {
            setGlobalError("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  const handleClose = () => navigate("..");

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
        Reset Password
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {isPending ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Updating your password...
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
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

            <Password
              form={{ register, formState: { errors }, watch, setError }}
              confirmPassword
              confirmPasswordRules={{
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
            />

            {globalError && (
              <AlertMessage severity="error">{globalError}</AlertMessage>
            )}
          </Stack>
        )}
      </DialogContent>

      {!isSuccess && (
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            endIcon={<LoginIcon />}
            sx={{
              backgroundColor: "#20477B",
              "&:hover": { backgroundColor: "#16365E" },
            }}
            fullWidth
          >
            {isPending ? "Processing..." : "Reset Password"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
