/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { useRegister } from "../queries/data";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Notification from "./Notification";

export default function Register({ handleSetToken }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm({ mode: "onBlur" });

  const registerUser = useRegister();
  const onSubmit = (data) => {
    registerUser.mutate(
      { data },
      {
        onSuccess: (data) => {
          window.location.href = "/";
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
      <Card
        p={1}
        sx={{
          height: "100%",
          background:
            "linear-gradient(65deg, #005A83 20%, #036595 20%, #0571A4 40%, #005A83 40%);",
          borderRadius: "0px",
        }}
      >
        <CardContent>
          <Card
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            p={2}
            sx={{
              maxWidth: 600,
              margin: "auto",
              mt: "10vh",
              height: "100%",
              borderRadius: "10px",
            }}
          >
            <CardHeader
              title="Registration Form"
              sx={{ backgroundColor: "#338BCB", color: "white" }}
            >
              Login
            </CardHeader>
            <CardContent sx={{ display: "flex", p: 3, mt: 3 }}>
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
            <CardContent sx={{ p: 3 }}>
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
            <CardContent sx={{ display: "flex", p: 3 }}>
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

            <CardContent sx={{ p: 3 }}>
              <TextField
                {...register("organization")}
                label="Organization"
                sx={{ width: "100%" }}
              />
            </CardContent>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2">
                Already have an account?
              </Typography>
              <Typography variant="subtitle2">
                Login <Link to={"/"}>here</Link>!
              </Typography>
            </CardContent>
            <CardContent sx={{ p: 3 }}>
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
        </CardContent>
      </Card>
      {registerUser.isSuccess ? (
        <Notification message={"Registration completeted successfully"} />
      ) : (
        ""
      )}
    </>
  );
}
