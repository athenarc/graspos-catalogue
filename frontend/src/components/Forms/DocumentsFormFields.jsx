import {
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
} from "@mui/material";

export default function DocumentFormFields({ form }) {
  return (
    <Stack direction="column" sx={{ mt: 2 }}>
      <Stack direction="row" useFlexGap spacing={2} sx={{ mt: 2 }}>
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
        <FormControl fullWidth>
          <InputLabel>Format</InputLabel>
          <Select
            {...form?.register("format")}
            label="Format"
            fullWidth
            defaultValue="csv"
          >
            <MenuItem value={"csv"}>CSV</MenuItem>
            <MenuItem value={"pdf"}>PDF</MenuItem>
            <MenuItem value={"xls"}>XLS</MenuItem>
            <MenuItem value={"json"}>JSON</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
