import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlertHelperText from "@helpers/AlertHelperText";

export default function PasswordField({
  form,
  label,
  id,
  register,
  error,
  rules = {},
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled =
    form?.formState?.isSubmitting || form?.formState?.isSubmitSuccessful;

  const handleClickShowPassword = () => {
    if (!isDisabled) setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <FormControl fullWidth variant="outlined" disabled={isDisabled}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput
          id={id}
          type={showPassword ? "text" : "password"}
          label={label}
          required={required}
          error={!!error}
          placeholder={label}
          {...register(rules)}
          disabled={isDisabled}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                disabled={isDisabled}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      {!!error && <AlertHelperText error={error} />}
    </>
  );
}
