import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../../queries/data.js";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const login = useLogin();
  const { handleLogin } = useOutletContext();
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
          Login Form
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
          <TextField
            {...register("username", {
              required: "Username can not be empty",
            })}
            required
            id="outlined-required"
            label="Username"
            error={!!errors?.username}
            helperText={errors?.username?.message}
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogContent sx={{ p: 2 }}>
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
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogContent sx={{ p: 1 }}>
          <Typography align="center" variant="subtitle2">
            Don't have an account?
          </Typography>
          <Typography align="center" variant="subtitle2">
            Register <Link to={"/register"}>here</Link>!
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
