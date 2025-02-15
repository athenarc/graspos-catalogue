/* eslint-disable react/prop-types */
import {
  Stack,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLogin } from "../queries/data";
import { Link } from "react-router-dom";

export default function Login({ handleSetToken }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const login = useLogin();

  function submitLogin() {
    if (!username) {
      setUsernameError("Username can not be empty");
    }
    if (!password) {
      setPasswordError("Password can not be empty");
    }
    if (!username || !password) {
      return;
    } else {
      login.mutate(
        { username, password },
        {
          onSuccess: (data) => {
            handleSetToken(data?.data?.access_token);
            window.location.href = "/";
          },
          onError: (data) => {
            if (data?.response?.data?.detail[0]?.msg) {
              setUsernameError(data?.response?.data?.detail[0]?.msg);
            } else if (data?.response?.data?.detail) {
              setPasswordError(data?.response?.data?.detail);
            } else {
              setPasswordError("An error occurred");
            }
          },
        }
      );
    }
  }
  function handleUsernameChange(value) {
    setUsernameError("");
    setUsername(value);
  }
  function handlePasswordChange(value) {
    setPasswordError("");
    setPassword(value);
  }
  return (
    <Paper
      component={Stack}
      direction="column"
      justifyContent="center"
      sx={{ height: "100%", background: "inherit" }}
    >
      <Card
        p={2}
        sx={{
          width: 400,
          margin: "auto",
          borderRadius: "10px",
        }}
      >
        <CardHeader
          title="Login Form"
          sx={{ backgroundColor: "#338BCB", color: "white" }}
        >
          Login
        </CardHeader>
        <CardContent sx={{ m: 1, mt: 4 }}>
          <TextField
            required
            id="outlined-required"
            label="Username"
            defaultValue=""
            error={usernameError !== ""}
            helperText={usernameError}
            onChange={(e) => handleUsernameChange(e.target.value)}
            sx={{ width: "80%" }}
          />
        </CardContent>
        <CardContent sx={{ m: 1 }}>
          <TextField
            required
            id="outlined-password-input"
            label="Password"
            type="password"
            error={passwordError !== ""}
            helperText={passwordError}
            autoComplete="current-password"
            onChange={(e) => handlePasswordChange(e.target.value)}
            sx={{ width: "80%" }}
          />
        </CardContent>
        <CardContent sx={{ m: 1 }}>
          <Typography variant="subtitle2">Don't have an account?</Typography>
          <Typography variant="subtitle2">
            Register <Link to={"/register"}>here</Link>!
          </Typography>
        </CardContent>
        <CardContent sx={{ m: 1 }}>
          <Button variant="contained" onClick={(e) => submitLogin(e)}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Paper>
  );
}
