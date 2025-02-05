/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useLogin } from "../queries/data";

export default function Login({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const login = useLogin();

  function submitLogin() {
    if (!email) {
      setEmailError("Email can not be empty");
    }
    if (!password) {
      setPasswordError("Password can not be empty");
    }
    if (!email || !password) {
      return;
    } else {
      login.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            setToken(data.data.access_token);
          },
          onError: (data) => {
            if (data?.response?.data?.detail[0].msg){
              setEmailError(data?.response?.data?.detail[0].msg);
            }else if (data?.response?.data?.detail){
              setPasswordError(data?.response?.data?.detail);
            }else{
              setPasswordError("An error occurred");
            }
            
          },
        }
      );
    }
  }
  function handleEmailChange(value) {
    setEmailError("");
    setEmail(value);
  }
  function handlePasswordChange(value) {
    setPasswordError("");
    setPassword(value);
  }
  return (
    <Card
      sx={{
        height: "100%",
        background:
          "linear-gradient(65deg, #005A83 20%, #036595 20%, #0571A4 40%, #005A83 40%);",
      }}
    >
      <CardContent>
        <Card
          p={2}
          sx={{
            maxWidth: 400,
            margin: "auto",
            mt: "30vh",
            height: "100%",
            borderRadius: "10px",
          }}
        >
          <CardHeader
            title="Login Form"
            sx={{ backgroundColor: "#338BCB", color: "white" }}
          >
            Login
          </CardHeader>
          <CardContent sx={{ m: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="Email"
              defaultValue=""
              error={emailError !== ""}
              helperText={emailError}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              sx={{ width: "80%" }}
            />
          </CardContent>
          <CardContent sx={{ m: 2 }}>
            <TextField
              required
              id="outlined-password-input"
              label="Password"
              type="password"
              error={passwordError !== ""}
              helperText={passwordError}
              value={password}
              autoComplete="current-password"
              onChange={(e) => handlePasswordChange(e.target.value)}
              sx={{ width: "80%" }}
            />
          </CardContent>
          <CardContent sx={{ m: 2 }}>
            <Button variant="contained" onClick={(e) => submitLogin(e)}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
