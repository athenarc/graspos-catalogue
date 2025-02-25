import {
  TextField,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  TableBody,
  Autocomplete,
  Chip,
} from "@mui/material";

export default function DatasetForm({ register, errors }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={2}>
          <TextField
            required
            {...register("name", {
              required: "Name can not be empty",
            })}
            label="Name"
            error={!!errors?.name}
            helperText={errors?.name?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <FormControl fullWidth>
            <InputLabel>Visibility</InputLabel>
            <Select
              {...register("visibility")}
              defaultValue="public"
              label="Visibility"
              error={!!errors?.visibility}
            >
              <MenuItem value={"private"}>Private</MenuItem>
              <MenuItem value={"public"}>Public</MenuItem>
            </Select>
            <FormHelperText error>
              {errors?.visibility ? "Visibility can not be empty" : " "}
            </FormHelperText>
          </FormControl>
        </TableCell>

        <TableCell>
          <TextField
            required
            {...register("source", {
              required: "Source can not be empty",
              pattern: {
                value:
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                message: "Not a valid URL",
              },
            })}
            label="Source"
            error={!!errors?.source}
            helperText={errors?.source?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <TextField
            {...register("description")}
            label="Description"
            error={!!errors?.description}
            helperText={errors?.description?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <TextField
            {...register("license")}
            label="Licence"
            error={!!errors?.license}
            helperText={errors?.license?.message ?? " "}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <TextField
            {...register("version")}
            label="Version"
            error={!!errors?.version}
            helperText={errors?.version?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <TextField
            {...register("organization")}
            label="Organization"
            error={!!errors?.organization}
            helperText={errors?.organization?.message ?? " "}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <TextField
            {...register("tags")}
            label="Tags"
            error={!!errors?.tags}
            helperText={errors?.tags?.message ?? " "}
            fullWidth
          />
          {/* <Autocomplete
            {...register("tags")}
            disablePortal
            multiple
            options={[]}
            getOptionLabel={(option) => option.title}
            defaultValue={[]}
            freeSolo
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    label={option}
                    key={key}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Tags"
                error={!!errors?.tags}
                helperText={errors?.tags?.message ?? " "}
              />
            )}
          /> */}
        </TableCell>
      </TableRow>
      <TableRow></TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <TextField
            {...register("authors")}
            label="Authors"
            error={!!errors?.authors}
            helperText={errors?.authors?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <TextField
            {...register("api_url")}
            label="API URL"
            error={!!errors?.api_url}
            helperText={errors?.api_url?.message ?? " "}
            fullWidth
          />
        </TableCell>

        <TableCell>
          <TextField
            {...register("api_url_instructions")}
            label="API URL Instructions"
            error={!!errors?.api_url_instructions}
            helperText={errors?.api_url_instructions?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={2}>
          <TextField
            {...register("documentation_url")}
            label="Documentation URL"
            error={!!errors?.documentation_url}
            helperText={errors?.documentation_url?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <TextField
            {...register("contact_person")}
            label="Contact Person"
            error={!!errors?.contact_person}
            helperText={errors?.contact_person?.message ?? " "}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <TextField
            {...register("contact_person_email")}
            label="Contact person email"
            error={!!errors?.contact_person_email}
            helperText={errors?.contact_person_email?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
