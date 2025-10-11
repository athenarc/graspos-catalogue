export default function Password({ form }) {
  return (
    <TextField
      label="Password"
      type="password"
      {...form.register("password", {
        required: "Password is required",
      })}
      error={!!form.errors.password}
      helperText={form.errors.password?.message}
      fullWidth
    />
  );
}
