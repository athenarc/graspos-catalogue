import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import AlertHelperText from "@helpers/AlertHelperText";
import { useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Password({
  form,
  confirmPassword = false,
  confirmPasswordRules = {},
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          {...form?.register("password", {
            required: "Password can not be empty",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            },
          })}
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          label="Password"
          error={!!form?.formState?.errors?.password}
          fullWidth
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
        />
      </FormControl>
      {!!form?.formState?.errors?.password && (
        <AlertHelperText error={form?.formState?.errors?.password} />
      )}
      {confirmPassword && (
        <>
          <TextField
            {...form?.register("passwordConfirmation", confirmPasswordRules)}
            required
            id="password-confirm"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            error={!!form?.formState?.errors?.passwordConfirmation}
            fullWidth
          />
          {!!form?.formState?.errors?.passwordConfirmation && (
            <AlertHelperText
              error={form?.formState?.errors?.passwordConfirmation}
            />
          )}
        </>
      )}
    </Stack>
  );
}
