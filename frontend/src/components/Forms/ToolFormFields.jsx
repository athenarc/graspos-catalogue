import { Stack, TextField } from "@mui/material";

export default function ToolFormFields({ register, errors }) {
  return (
    <Stack direction="column" sx={{ mt: 2 }}>
      <Stack direction="row" useFlexGap spacing={2} sx={{ mt: 2 }}>
        <TextField
          {...register("doi", {
            required: "DOI is required",
            pattern: {
              value: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
              message: "Not a valid DOI",
            },
          })}
          label="DOI"
          error={!!errors?.doi}
          helperText={errors?.doi?.message ?? " "}
          fullWidth
          required
        />
      </Stack>
    </Stack>
  );
}
