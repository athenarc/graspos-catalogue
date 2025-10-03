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
          {...form?.register("organization")}
          label="Organization"
          placeholder="Organization"
          error={!!form?.formState?.errors?.organization}
          helperText={form?.formState?.errors?.organization?.message ?? " "}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Visibility</InputLabel>
          <Select
            {...form?.register("visibility")}
            defaultValue="public"
            label="Visibility"
          >
            <MenuItem value={"private"}>Private</MenuItem>
            <MenuItem value={"public"}>Public</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          {...form?.register("contact_person")}
          label="Contact Person"
          error={!!form?.formState?.errors?.contact_person}
          helperText={form?.formState?.errors?.contact_person?.message ?? " "}
          fullWidth
        />
        <TextField
          {...form?.register("contact_person_email")}
          label="Contact Person Email"
          error={!!form?.formState?.errors?.contact_person_email}
          helperText={
            form?.formState?.errors?.contact_person_email?.message ?? " "
          }
          fullWidth
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          {...form?.register("documentation_url")}
          label="Documentation Url"
          error={!!form?.formState?.errors?.documentation_url}
          helperText={
            form?.formState?.errors?.documentation_url?.message ?? " "
          }
          fullWidth
        />
        <TextField
          {...form?.register("api_url")}
          label="Api Url"
          error={!!form?.formState?.errors?.api_url}
          helperText={form?.formState?.errors?.api_url?.message ?? " "}
          fullWidth
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextareaAutosize
          {...form?.register("api_url_instructions")}
          minRows={6}
          placeholder="Api Url Instructions"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            borderColor: "#ccc",
          }}
        />
      </Stack>
    </Stack>
  );
}
