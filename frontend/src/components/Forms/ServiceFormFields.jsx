import { Stack, TextField, FormHelperText, Alert } from "@mui/material";
import TrlFormField from "./TrlFormField";
import AlertHelperText from "../Helpers/AlertHelperText";

export default function ServiceFormFields({ form, resource = null }) {
  const error = form?.formState?.errors?.url;

  return (
    <Stack direction="column" sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <TextField
          {...form?.register("url", {
            value: resource?.url,
            required: "URL is required",
            pattern: {
              value: /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
              message: "Not a valid URL",
            },
          })}
          required
          label="URL"
          defaultValue={resource?.url || ""}
          placeholder="URL of the resource"
          helperText=""
          error={!!error}
          fullWidth
        />
        {error && <AlertHelperText error={error} />}
      </Stack>
    </Stack>
  );
}
