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
            backgroundColor: "#338BCB",
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
        </DialogContent>
        <DialogContent sx={{ p: 2, pt: 0 }}>
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
        </DialogContent>

        <DialogContent sx={{ p: 2, pt: 0 }}>
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
        </DialogContent>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <TextField {...register("first_name")} label="First Name" fullWidth />
        </DialogContent>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <TextField {...register("last_name")} label="Last Name" fullWidth />
        </DialogContent>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <TextField
            {...register("organization")}
            label="Organization"
            fullWidth
          />
        </DialogContent>
        <DialogContent sx={{ p: 2, pt: 0  }}>
          <Typography align="center" variant="subtitle2">
            Already have an account?
          </Typography>
          <Typography align="center" variant="subtitle2">
            Login <Link to={"/login"}>here</Link>!
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0  }}>
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
