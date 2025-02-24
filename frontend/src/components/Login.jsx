import {
  Stack,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useLogin } from "../queries/data";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "./AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const login = useLogin();
  const onSubmit = (data) => {
    login.mutate(
      { data },
      {
        onSuccess: (data) => {
          handleLogin(data?.data?.access_token);
          navigate("/");
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
  return (
    <Box
      component={Stack}
      direction="column"
      justifyContent="center"
      sx={{ height: "100%", background: "inherit", paddingTop: "8%" }}
    >
      <Card
        p={2}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          minWidth: 350,
          margin: "auto",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <CardHeader
          title="Login Form"
          sx={{ backgroundColor: "#338BCB", color: "white", p: 2 }}
        >
          Login
        </CardHeader>
        <CardContent sx={{ p: 4 }}>
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
        </CardContent>
        <CardContent sx={{ p: 4, pt: 0 }}>
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
        </CardContent>
        <CardContent sx={{ textAlign: "center", p: 4, pt: 0 }}>
          <Typography variant="subtitle2">Don't have an account?</Typography>
          <Typography variant="subtitle2">
            Register <Link to={"/register"}>here</Link>!
          </Typography>
        </CardContent>
        <CardContent sx={{ p: 4, pt: 0 }}>
          <Button type="submit" variant="contained" disabled={login.isLoading}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
