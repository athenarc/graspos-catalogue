import { useEffect, useState } from "react";

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

export default function AccessRightFilter({
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

  const { data: datasetData, isLoading: isDatasetLoading } =
    useDatasetUniqueFieldValues(fieldToSearch, selectedResource === 0, scope);
  const { data: documentData, isLoading: isDocumentLoading } =
    useDocumentUniqueFieldValues(fieldToSearch, selectedResource === 2, scope);
  const { data: toolData, isLoading: isToolLoading } = useToolUniqueFieldValues(
    fieldToSearch,
    selectedResource === 1,
    scope
  );
  const { data: serviceData, isLoading: isServiceLoading } =
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
        ? datasetData?.data?.["unique_" + fieldToSearch]
        : selectedResource === 2
        ? documentData?.data?.["unique_" + fieldToSearch]
        : selectedResource === 1
        ? toolData?.data?.["unique_" + fieldToSearch]
        : serviceData?.data?.["unique_" + fieldToSearch];

    setOptions(resourceData || []);
  }, [
    selectedResource,
    datasetData,
    documentData,
    toolData,
    serviceData,
    isDatasetLoading,
    isDocumentLoading,
    isToolLoading,
    isServiceLoading,
    fieldToSearch,
  ]);

  useEffect(() => {
    if (selectedFilters?.[field] && options.length) {
      const valid = selectedFilters[field].filter((val) =>
        options.includes(val)
      );
      setSelectedFields(valid);
    }
  }, [selectedFilters, options, field]);

  const handleChange = (event, value) => {
    setSelectedFields(value);
    onFilterChange({ [field]: value });
  };

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        {field.charAt(0).toUpperCase() + field.slice(1).replaceAll("_", " ")}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Autocomplete
        multiple
        fullWidth
        options={options}
        value={selectedFields}
        onChange={handleChange}
        getOptionLabel={(option) => option}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...restTagProps } = getTagProps({ index });
            return <Chip label={option} {...restTagProps} key={option} />;
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
