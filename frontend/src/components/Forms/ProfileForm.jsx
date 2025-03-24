import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "../../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "../Notification";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function ResetPassword({ register, errors }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <DialogContent sx={{ p: 2 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          {...register("password", { value: "" })}
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
    </DialogContent>
  );
}

export default function ProfileForm() {
  const { user } = useOutletContext();
  const [showPassowrd, setShowPassword] = useState(false);

  function handleSetShowPassword() {
    setShowPassword(!showPassowrd);
  }
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const updateUser = useUpdateUser();
  const onSubmit = (data) => {
    updateUser.mutate(
      { data },
      {
        onSuccess: () => {
          reset();
          setMessage("User information updated successfully!");
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
        },
      }
    );
  };

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  function handleClose() {
    navigate("..");
  }

  return (
    user && (
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
            My Profile
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
                value: user?.username,
              })}
              disabled
              label="Username"
              sx={{ width: "100%" }}
            />
          </DialogContent>
          <Button
            onClick={handleSetShowPassword}
            endIcon={showPassowrd ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            sx={{ p: 0, mt: [showPassowrd ? 2 : 0] }}
          >
            Change Password
          </Button>
          {showPassowrd && (
            <ResetPassword
              register={register}
              user={user}
              setError={setError}
              errors={errors}
            />
          )}
          <DialogContent sx={{ p: 2 }}>
            <TextField
              required
              {...register("email", {
                value: user?.email,
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
          </DialogContent>
          <DialogContent sx={{ p: 2 }}>
            <TextField
              {...register("first_name", {
                value: user?.first_name,
              })}
              label="First Name"
              sx={{ width: "100%" }}
            />
          </DialogContent>
          <DialogContent sx={{ p: 2 }}>
            <TextField
              {...register("last_name", { value: user?.email })}
              label="Last Name"
              sx={{ width: "100%" }}
            />
          </DialogContent>
          <DialogContent sx={{ p: 2 }}>
            <TextField
              {...register("organization", {
                value: user?.organization,
              })}
              label="Organization"
              sx={{ width: "100%" }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={updateUser.isLoading}
              loading={updateUser.isLoading}
              endIcon={<SaveIcon />}
              loadingPosition="end"
              sx={{ backgroundColor: "#20477B" }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {(updateUser?.isSuccess || updateUser?.isError) && (
          <Notification requestStatus={updateUser?.status} message={message} />
        )}
      </>
    )
  );
}
