import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Notification from "@helpers/Notification";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useRegister } from "@queries/data";
import { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import AlertHelperText from "../Helpers/AlertHelperText";
import Password from "./Fields/Password";

const SITE_KEY = process.env.REACT_APP_CAPTCHA_SITE_KEY;

export default function RegisterForm() {
  const [message, setMessage] = useState("");
  const form = useForm({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = form;

  const navigate = useNavigate();
  const registerUser = useRegister();

  const captchaRef = useRef(null);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "captcha_token" && value.captcha_token) {
        clearErrors("captcha_token");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  const onSubmit = (data) => {
    if (!data.captcha_token) {
      setError("captcha_token", {
        type: "manual",
        message: "Please verify that you are not a robot.",
      });
      return;
    }

    registerUser.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("Registration successful!");
          setTimeout(() => navigate(".."), 1000);
        },
        onError: (e) => {
          const error = e?.response?.data?.detail;

          if (error && !error.captcha_token && captchaRef.current) {
            captchaRef.current.reset();
            setValue("captcha_token", "");
          }

          if (error?.captcha_token) {
            setMessage(error.captcha_token);
            setError("captcha_token", {
              type: "server",
              message: error.captcha_token,
            });
          }

          if (error?.email) {
            setMessage(error.email);
            setError("email", { type: "server", message: error.email });
          }

          if (error?.username) {
            setMessage(error.username);
            setError("username", { type: "server", message: error.username });
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Registration form
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
          <Stack spacing={2}>
            <Stack spacing={2}>
              <TextField
                required
                {...register("username", {
                  required: "Username can not be empty",
                })}
                label="Username"
                error={!!errors?.username}
                fullWidth
              />
              {!!errors?.username && (
                <AlertHelperText error={errors?.username} />
              )}

              <Password
                form={form}
                confirmPassword
                confirmPasswordRules={{
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                }}
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
                fullWidth
              />
              {!!errors?.email && <AlertHelperText error={errors?.email} />}
            </Stack>

            <Stack direction="column" spacing={2}>
              <TextField
                {...register("first_name")}
                label="First name"
                fullWidth
              />
              <TextField
                {...register("last_name")}
                label="Last name"
                fullWidth
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

              <Stack alignItems="center" sx={{ mt: 2 }}>
                <Controller
                  name="captcha_token"
                  control={control}
                  rules={{
                    required: "Please verify that you are not a robot.",
                  }}
                  render={({ field }) => (
                    <ReCAPTCHA
                      sitekey={SITE_KEY}
                      ref={captchaRef}
                      onChange={(token) =>
                        setValue("captcha_token", token, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
                {errors?.captcha_token && (
                  <AlertHelperText error={errors?.captcha_token} />
                )}
              </Stack>
            </Stack>
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
          message={"Registration completed successfully"}
        />
      )}
    </>
  );
}
