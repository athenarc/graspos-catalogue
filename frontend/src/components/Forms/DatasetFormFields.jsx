import {
  TextField,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
} from "@mui/material";

export default function DatasetFormFields({ form, resource = null }) {
  return (
    <Stack direction="column" sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <TextField
          {...form?.register("url", {
            value: resource?.url,
            pattern: {
              value: /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
              message: "Not a valid URL",
            },
          })}
          label="URL"
          defaultValue={resource?.url || ""}
          placeholder="URL of the resource"
          error={!!form?.formState?.errors?.url}
          helperText={form?.formState?.errors?.url?.message ?? ""}
          fullWidth
        />
      </Stack>
    </Stack>
  );
}
