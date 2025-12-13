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
import { useToolUniqueFieldValues } from "@queries/tool";

export default function ServiceTypeAutocompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [trlTypeOptions, setTrlTypeOptions] = useState([]);

  const { data: serviceTrlTypeData, isLoading: isServiceLoading } =
    useServiceUniqueFieldValues("trl", selectedResource === 3, "local");
  const { data: toolTrlTypeData, isLoading: isToolLoading } =
    useToolUniqueFieldValues("trl", selectedResource === 1, "local");

  useEffect(() => {
    if (isServiceLoading || isToolLoading) return;

    const resourceTrlTypeData =
      selectedResource === 3
        ? serviceTrlTypeData?.data?.unique_trl
        : selectedResource === 1
        ? toolTrlTypeData?.data?.unique_trl
        : [];

    const ids = resourceTrlTypeData?.map((t) => t) || [];
    setTrlTypeOptions(ids);
  }, [
    selectedResource,
    serviceTrlTypeData,
    toolTrlTypeData,
    isServiceLoading,
    isToolLoading,
  ]);

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
          value.map((option, index) => {
            const { key, ...restTagProps } = getTagProps({ index });
            return (
              <Chip
                label={option}
                {...restTagProps}
                key={option + "-" + index}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Select service types"
          />
        )}
        disabled={selectedResource !== 3 && selectedResource !== 1}
      />
    </Stack>
  );
}
