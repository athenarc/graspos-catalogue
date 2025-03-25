import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography,
  DialogContentText,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Notification from "../Notification";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegister } from "../../queries/data";
import { useState } from "react";

export default function RegisterForm() {
  const [message, setMessage] = useState("");
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
          setMessage("Registration successfull!");
          setTimeout(() => {
            navigate("..");
          }, 1000);
        },
        onError: (e) => {
          const error = e?.response?.data?.detail;
          if (error.email) {
            setMessage(error.email);
            setError("email", {
              type: "server",
              message: error.email,
            });
          }
          if (error.username) {
            setMessage(error.username);
            setError("username", {
              type: "server",
              message: error.username,
            });
          }
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
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Registration Form
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
          <Stack direction="column" spacing={2}>
            <TextField
              required
              {...register("username", {
                required: "Username can not be empty",
              })}
              label="Username"
              error={!!errors?.username}
              helperText={errors?.username?.message}
              fullWidth
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
              fullWidth
            />
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
              fullWidth
            />
            <TextField
              {...register("first_name")}
              label="First Name"
              fullWidth
            />

            <TextField {...register("last_name")} label="Last Name" fullWidth />

            <TextField
              {...register("orcid", {
                pattern: {
                  value: /^(\d{4}-){3}\d{3}(\d|X)$/,
                  message: "Orcid not in correct format",
                },
              })}
              label="Orcid"
              fullWidth
              error={!!errors?.orcid}
              helperText={errors?.orcid?.message}
            />
            <TextField
              {...register("organization")}
              label="Organization"
              fullWidth
            />
            <Typography align="center" variant="subtitle2">
              Already have an account?
            </Typography>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ mt: "0 !important;" }}
            >
              Login <Link to={"/login"}>here</Link>!
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={registerUser.isPending}
            loading={registerUser.isPending}
            endIcon={<HowToRegIcon />}
            loadingPosition="end"
            sx={{ backgroundColor: "#20477B" }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
      {registerUser.isSuccess && (
        <Notification
          requestStatus={registerUser?.status}
          message={"Registration completeted successfully"}
        />
      )}
    </>
  );
}
