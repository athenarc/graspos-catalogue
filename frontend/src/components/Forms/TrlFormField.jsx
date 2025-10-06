import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTrls } from "@queries/trl";
import { useEffect } from "react";
export default function TrlFormField({
  form,
  name,
  label,
  required = false,
  resource = null,
  searchedResource = null,
}) {
  const { data: trls, isLoading, isSuccess } = useTrls();
  const selectedTrl = resource?.trl || searchedResource?.metadata?.trl || "";

  return (
    <>
      {isLoading && <CircularProgress size={24} />}
      {isSuccess && (
        <FormControl
          variant="outlined"
        >
          <InputLabel id="sort-filter-label">{label}</InputLabel>
          <Select
            {...form?.register("trl", { value: selectedTrl?.id })}
            defaultValue={selectedTrl?.id || ""}
            label={label}
            error={!!form?.formState?.errors["trl"]}
            helperText={form?.formState?.errors["trl"]?.message}
            fullWidth
            disabled={!!searchedResource?.metadata?.trl}
          >
            {trls?.data?.map((trl) => (
              <MenuItem key={trl?._id} value={trl?._id}>
                {trl?.trl_id + " - " + trl?.european_description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
}
