import { Stack, TextField } from "@mui/material";
import AlertHelperText from "@helpers/AlertHelperText";

export default function ServiceFormFields({ form, resource = null }) {
  const error = form?.formState?.errors?.url;

  return (
    <Stack direction="row" useFlexGap spacing={2} alignItems="flex-start">
      <Stack flex={1}>
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
