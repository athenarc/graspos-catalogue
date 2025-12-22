import { Stack } from "@mui/material";
import PasswordField from "@fields/Password/PasswordField";

export default function PasswordFormFields({
  form,
  newPasswordValidation = true,
  currentPasswordValidation = true,
  confirmPassword = false,
  confirmPasswordRules = {},
  previousPassword = false,
}) {
  const passwordRules = {
    required: "Password cannot be empty",
    minLength: currentPasswordValidation && {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    pattern: currentPasswordValidation && {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    },
  };

  const newPasswordRules = {
    required: "New password cannot be empty",
    minLength: newPasswordValidation && {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    pattern: newPasswordValidation && {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    },
  };

  return (
    <Stack spacing={2}>
      <PasswordField
        label="Password"
        id="password"
        disabled={form?.formState?.isSubmitting}
        register={(rules) => form?.register("password", passwordRules)}
        error={form?.formState?.errors?.password}
      />

      {previousPassword && (
        <PasswordField
          label="New Password"
          id="new-password"
          register={(rules) => form?.register("new_password", newPasswordRules)}
          error={form?.formState?.errors?.new_password}
        />
      )}

      {confirmPassword && (
        <PasswordField
          label="Confirm New Password"
          id="confirm-new-password"
          register={(rules) =>
            form?.register("confirm_new_password", confirmPasswordRules)
          }
          error={form?.formState?.errors?.confirm_new_password}
        />
      )}
    </Stack>
  );
}
