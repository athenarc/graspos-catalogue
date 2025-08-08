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
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "../../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "@helpers/Notification";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../AuthContext";

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
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <OutlinedInput
        {...register("password")}
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
  );
}

export default function ProfileForm() {
  const { user } = useAuth();
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
    navigate(-1);
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
            My profile
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
                  value: user?.username,
                })}
                disabled
                label="Username"
                sx={{ width: "100%" }}
              />
              <Button
                onClick={handleSetShowPassword}
                endIcon={
                  showPassowrd ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                }
                sx={{ p: 0 }}
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
                fullWidth
              />
              <TextField
                {...register("first_name", {
                  value: user?.first_name,
                })}
                label="First Name"
                sx={{ width: "100%" }}
              />
              <TextField
                {...register("last_name", { value: user?.email })}
                label="Last Name"
                sx={{ width: "100%" }}
              />

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
                {...register("organization", {
                  value: user?.organization,
                })}
                label="Organization"
                sx={{ width: "100%" }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={updateUser.isPending}
              loading={updateUser.isPending}
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
