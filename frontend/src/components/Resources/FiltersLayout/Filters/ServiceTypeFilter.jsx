import {
  Autocomplete,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useServiceUniqueFieldValues } from "../../../../queries/service";

export default function ServiceTypeAutocompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [serviceTypeOptions, setServiceTypeOptions] = useState([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState(
    selectedFilters?.service_type || []
  );

  const { data: serviceTypeData, isLoading } = useServiceUniqueFieldValues(
    "service_type",
    selectedResource === 3
  );

  useEffect(() => {
    if (!isLoading && selectedResource === 3) {
      const types = serviceTypeData?.data?.unique_service_type || [];
      setServiceTypeOptions(types);
    }
  }, [selectedResource, serviceTypeData, isLoading]);

  useEffect(() => {
    if (selectedFilters?.service_type) {
      const valid = selectedFilters.service_type.filter((type) =>
        serviceTypeOptions.includes(type)
      );

      if (JSON.stringify(valid) !== JSON.stringify(selectedServiceTypes)) {
        setSelectedServiceTypes(valid);
        onFilterChange({ service_type: valid });
      }
    }
  }, [selectedFilters, serviceTypeOptions]);

  const handleChange = (event, value) => {
    setSelectedServiceTypes(value);
    onFilterChange({ service_type: value });
  };

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        Service Type
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Autocomplete
        multiple
        fullWidth
        options={serviceTypeOptions}
        value={selectedServiceTypes}
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
