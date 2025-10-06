import { Stack, TextField } from "@mui/material";
import TrlFormField from "./TrlFormField";

export default function ToolFormFields({ form, resource = null }) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 2 }}>
      <TrlFormField form={form} name="trl" label="TRL" resource={resource} />
    </Stack>
  );
}
