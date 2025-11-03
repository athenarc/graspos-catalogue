import { Stack, TextField } from "@mui/material";
import TrlFormField from "./TrlFormField";

export default function ToolFormFields({ form, resource = null }) {
  return (
    <Stack direction="column" sx={{ my: 2 }}>
      <Stack direction="row" spacing={2}>
        <TrlFormField form={form} name="trl" label="TRL" resource={resource} />
      </Stack>
    </Stack>
  );
}
