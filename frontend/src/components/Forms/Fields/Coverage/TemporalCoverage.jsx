import { TextField } from "@mui/material";

export default function TemporalCoverage({ form, resource = null }) {
  return (
    <TextField
      label="Temporal Coverage"
      {...form.register("temporal_coverage")}
      fullWidth
      defaultValue={resource?.temporal_coverage || ""}
    />
  );
}
