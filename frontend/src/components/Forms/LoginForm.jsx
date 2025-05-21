import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../../queries/data.js";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../AuthContext.jsx";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const login = useLogin();
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    login.mutate(
      { data },
      {
        onSuccess: (data) => {
          handleLogin(data?.data);
          handleClose();
        },
        onError: (error) => {
          setError("password", {
            type: "server",
            message: error?.response?.data?.detail,
          });
        },
      }
    );
  };

  function handleClose() {
    navigate(-1);
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
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Login form
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
        <DialogContent sx={{ p: 2, pb: 0 }}>
          <Stack direction="column" spacing={2}>
            <TextField
              {...register("username", {
                required: "Username can not be empty",
              })}
              required
              id="outlined-required"
              label="Username"
              error={!!errors?.username}
              helperText={errors?.username?.message}
              fullWidth
            />
            <TextField
              {...register("password", {
                required: "Password can not be empty",
              })}
              required
              id="outlined-password-input"
              label="Password"
              type="password"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              autoComplete="current-password"
              fullWidth
            />
            <Typography align="center" variant="subtitle2">
              Don't have an account?
            </Typography>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ mt: "0 !important;" }}
            >
              Register <Link to={"/register"}>here</Link>!
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={login.isPending}
            loading={login.isPending}
            endIcon={<LoginIcon />}
            loadingPosition="end"
            sx={{ backgroundColor: "#20477B" }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
