/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useRegister } from "../queries/data";
import { Link } from "react-router-dom";

export default function Register({ handleSetToken }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const register = useRegister();

  function submitRegister() {

    if (!username) {
      setUsernameError("Username can not be empty");
    }
    if (!password) {
      setPasswordError("Password can not be empty");
    }
    if (!email) {
      setEmailError("Email can not be empty");
    }
    if (!username || !password || !email) {
      
      return;
    } else {
      console.log("mutate")
      register.mutate(
        { username, password, email, firstName, lastName },
        {
          onSuccess: (data) => {
            window.location.href = "/";
          },
          onError: (error) => {
            if (
              error?.response?.data?.detail ==
              "User with that email already exists"
            ) {
              setEmailError(error?.response?.data?.detail);
            } else if (
              error?.response?.data?.detail ==
              "User with that username already exists"
            ) {
              setEmailError(error?.response?.data?.detail);
            } else {
              setEmailError(error?.response?.data?.detail[0]?.msg);
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
            maxWidth: 600,
            margin: "auto",
            mt: "5%",
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
          <CardContent sx={{ m: 1 }}>
            <Table>
              <TableRow>
                <TableCell colSpan={2}>
                  <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    error={emailError != ""}
                    helperText={emailError}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    sx={{ width: "100%" }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    required
                    id="outlined-required"
                    label="Username"
                    error={usernameError != ""}
                    helperText={usernameError}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    required
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    error={passwordError != ""}
                    helperText={passwordError}
                    autoComplete="current-password"
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    label="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
            </Table>
          </CardContent>
          <CardContent>
            <Typography variant="subtitle2">Already have an account?</Typography>
            <Typography variant="subtitle2">
              Login <Link to={"/"}>here</Link>!
            </Typography>
          </CardContent>
          <CardContent sx={{ m: 2 }}>
            <Button variant="contained" onClick={(e) => submitRegister(e)}>
              Register
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
