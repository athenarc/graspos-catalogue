import {
  Autocomplete,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useServiceUniqueFieldValues } from "@queries/service";

export default function ServiceTypeAutocompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [trlTypeOptions, setTrlTypeOptions] = useState([]);

  const { data: trlTypeData, isLoading } = useServiceUniqueFieldValues(
    "trl",
    selectedResource === 3,
    "local"
  );
  useEffect(() => {
    if (!isLoading && selectedResource === 3) {
      const types = trlTypeData?.data?.unique_trl || [];
      setTrlTypeOptions(types);
      console.log("TRL Types:", trlTypeData?.data?.unique_trl);
    }
  }, [selectedResource, trlTypeData, isLoading]);

  const selectedTrlTypes = selectedFilters?.trl || [];

  const handleChange = (event, value) => {
    onFilterChange({ trl: value });
  };

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        Technology Readiness Level
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Autocomplete
        multiple
        fullWidth
        options={trlTypeOptions}
        value={selectedTrlTypes}
        onChange={handleChange}
        getOptionLabel={(option) => option}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Select service types"
          />
        )}
        disabled={selectedResource !== 3}
      />
    </Stack>
  );
}
