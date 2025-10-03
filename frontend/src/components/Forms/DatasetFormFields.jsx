import {
  TextField,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
} from "@mui/material";

export default function DatasetFormFields({ register, errors }) {
  // console.log("DatasetFormFields errors:", errors);
  return (
    <Stack direction="column" sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <TextField
          {...register("doi", {
            required: "DOI is required",
            pattern: {
              value: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
              message: "Not a valid DOI",
            },
          })}
          label="DOI"
          error={!!errors?.doi}
          helperText={errors?.doi?.message ?? " "}
          fullWidth
          required
        />

        <TextField
          {...register("organization")}
          label="Organization"
          error={!!errors?.organization}
          helperText={errors?.organization?.message ?? " "}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Visibility</InputLabel>
          <Select
            {...register("visibility")}
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
          {...register("contact_person")}
          label="Contact Person"
          error={!!errors?.contact_person}
          helperText={errors?.contact_person?.message ?? " "}
          fullWidth
        />
        <TextField
          {...register("contact_person_email")}
          label="Contact Person Email"
          error={!!errors?.contact_person_email}
          helperText={errors?.contact_person_email?.message ?? " "}
          fullWidth
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          {...register("documentation_url")}
          label="Documentation Url"
          error={!!errors?.documentation_url}
          helperText={errors?.documentation_url?.message ?? " "}
          fullWidth
        />
        <TextField
          {...register("api_url")}
          label="Api Url"
          error={!!errors?.api_url}
          helperText={errors?.api_url?.message ?? " "}
          fullWidth
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextareaAutosize
          {...register("api_url_instructions")}
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
