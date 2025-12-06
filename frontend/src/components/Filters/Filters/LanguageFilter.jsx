import {
  Autocomplete,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useDatasetUniqueFieldValues } from "@queries/dataset";
import { useDocumentUniqueFieldValues } from "@/queries/document";
import { useToolUniqueFieldValues } from "@/queries/tool";
import { useServiceUniqueFieldValues } from "@/queries/service";
import { useEffect, useState } from "react";

export default function LanguageAutocompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
  fieldToSearch,
  field,
  scope = "zenodo",
}) {
  const [options, setOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState(
    selectedFilters?.[field] || []
  );

  const { data: datasetLicenseData, isLoading: isDatasetLoading } =
    useDatasetUniqueFieldValues(fieldToSearch, selectedResource === 0, scope);

  const { data: documentLicenseData, isLoading: isDocumentLoading } =
    useDocumentUniqueFieldValues(fieldToSearch, selectedResource === 2, scope);

  const { data: toolLicenseData, isLoading: isToolLoading } =
    useToolUniqueFieldValues(fieldToSearch, selectedResource === 1, scope);

  const { data: serviceLicenseData, isLoading: isServiceLoading } =
    useServiceUniqueFieldValues(fieldToSearch, selectedResource === 3, scope);

  useEffect(() => {
    if (
      isDatasetLoading ||
      isDocumentLoading ||
      isToolLoading ||
      isServiceLoading
    )
      return;

    const resourceData =
      selectedResource === 0
        ? datasetLicenseData?.data?.["unique_" + fieldToSearch]
        : selectedResource === 2
        ? documentLicenseData?.data?.["unique_" + fieldToSearch]
        : selectedResource === 1
        ? toolLicenseData?.data?.["unique_" + fieldToSearch]
        : serviceLicenseData?.data?.["unique_" + fieldToSearch];

    setOptions(resourceData || []);
  }, [
    selectedResource,
    datasetLicenseData,
    documentLicenseData,
    toolLicenseData,
    serviceLicenseData,
    isDatasetLoading,
    isDocumentLoading,
    isToolLoading,
    isServiceLoading,
    fieldToSearch,
  ]);

  useEffect(() => {
    if (selectedFilters?.[field] && options.length) {
      const validObjects = options.filter((o) =>
        selectedFilters[field].includes(o.alpha_3)
      );

      if (JSON.stringify(validObjects) !== JSON.stringify(selectedFields)) {
        setSelectedFields(validObjects);
      }
    }
  }, [selectedFilters, options]);

  const handleChange = (event, value) => {
    setSelectedFields(value);
    const updated = value.map((o) => o.alpha_3);
    onFilterChange({ [field]: updated });
  };

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Autocomplete
        multiple
        fullWidth
        options={options}
        value={selectedFields}
        onChange={handleChange}
        getOptionLabel={(option) => {
          return option?.name || option?.alpha_3 || option;
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            return (
              <Chip
                key={option?.alpha_3}
                label={option?.name || option?.alpha_3}
                {...getTagProps({ index })}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={
              "Select " + field.charAt(0).toUpperCase() + field.slice(1)
            }
          />
        )}
      />
    </Stack>
  );
}
