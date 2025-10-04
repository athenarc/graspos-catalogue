import { Stack, TextField } from "@mui/material";
import TrlFormField from "./TrlFormField";

export default function ToolFormFields({ form, resource = null }) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 2 }}>
      <TextField
        {...form?.register("doi", {
          required: "DOI is required",
          pattern: {
            value: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
            message: "Not a valid DOI",
          },
        })}
        label="DOI"
        error={!!form?.formState?.errors?.doi}
        helperText={form?.formState?.errors?.doi?.message ?? " "}
        fullWidth
        required
      />
      <TrlFormField form={form} name="trl" label="TRL" resource={resource} />
    </Stack>
  );
}
