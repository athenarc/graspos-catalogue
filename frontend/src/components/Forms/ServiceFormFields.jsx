import { Stack, TextField } from "@mui/material";

export default function ServiceFormFields({ form, resource = null }) {
  return (
    <Stack direction="row" useFlexGap spacing={2}>
      <TextField
        {...form?.register("url", {
          value: resource?.url,
          required: "URL is required",
          pattern: {
            value: /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
            message: "Not a valid URL",
          },
        })}
        label="URL"
        defaultValue={resource?.url || ""}
        placeholder="URL of the resource"
        error={!!form?.formState?.errors?.url}
        helperText={form?.formState?.errors?.url?.message ?? " "}
        fullWidth
      />
    </Stack>
  );
}
