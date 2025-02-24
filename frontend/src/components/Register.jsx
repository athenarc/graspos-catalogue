import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { useRegister } from "../queries/data";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Notification from "./Notification";

export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();

  const registerUser = useRegister();
  const onSubmit = (data) => {
    registerUser.mutate(
      { data },
      {
        onSuccess: (data) => {
          navigate("/login");
        },
        onError: (e) => {
          const error = e?.response?.data?.detail;
          if (error.email) {
            setError("email", {
              type: "server",
              message: error.email,
            });
          }
          if (error.username) {
            setError("username", {
              type: "server",
              message: error.username,
            });
          }
        },
      }
    );
  };

  return (
    <>
      <Box
        component={Stack}
        direction="column"
        justifyContent="center"
        sx={{ paddingTop: "6%" }}
      >
        <Card
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          p={2}
          sx={{
            // maxWidth: 600,
            margin: "auto",
            borderRadius: "10px",
          }}
        >
          <CardHeader
            title="Registration Form"
            sx={{ backgroundColor: "#338BCB", color: "white" }}
          >
            Login
          </CardHeader>
          <CardContent
            component={Stack}
            direction={"row"}
            spacing={4}
            sx={{ p: 4 }}
          >
            <TextField
              required
              {...register("username", {
                required: "Username can not be empty",
              })}
              label="Username"
              error={!!errors?.username}
              helperText={errors?.username?.message}
              sx={{ mr: 1, width: "100%" }}
            />
            <TextField
              required
              {...register("password", {
                required: "Password can not be empty",
              })}
              label="Password"
              type="password"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              sx={{ width: "100%" }}
            />
          </CardContent>
          <CardContent sx={{ p: 4, pt: 0 }}>
            <TextField
              required
              {...register("email", {
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
          </CardContent>
          <CardContent
            component={Stack}
            direction={"row"}
            spacing={4}
            sx={{ p: 4, pt: 0 }}
          >
            <TextField
              {...register("first_name")}
              label="First Name"
              sx={{ width: "100%", mr: 1 }}
            />
            <TextField
              {...register("last_name")}
              label="Last Name"
              sx={{ width: "100%" }}
            />
          </CardContent>

          <CardContent sx={{ p: 4, pt: 0 }}>
            <TextField
              {...register("organization")}
              label="Organization"
              sx={{ width: "100%" }}
            />
          </CardContent>
          <CardContent sx={{ p: 4, pt: 0, textAlign: "center" }}>
            <Typography variant="subtitle2">
              Already have an account?
            </Typography>
            <Typography variant="subtitle2">
              Login <Link to={"/login"}>here</Link>!
            </Typography>
          </CardContent>
          <CardContent sx={{ p: 4, pt: 0, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={registerUser.isLoading}
            >
              {registerUser.isLoading ? (
                <>
                  Creating user
                  <CircularProgress size="13px" sx={{ ml: 1 }} />
                </>
              ) : (
                <>
                  Register
                  <HowToRegIcon sx={{ ml: 1 }} />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </Box>
      {registerUser.isSuccess ? (
        <Notification
          requestStatus={registerUser?.status}
          message={"Registration completeted successfully"}
        />
      ) : (
        ""
      )}
    </>
  );
}
