import {
  Autocomplete,
  Chip,
  Divider,
  Typography,
  Stack,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useServiceUniqueFieldValues } from "@queries/service";
import { useToolUniqueFieldValues } from "@queries/tool";
import { useDatasetUniqueFieldValues } from "@queries/dataset";
import { useDocumentUniqueFieldValues } from "@queries/document";

export default function UniqueAutocompleteFieldFilter({
  field,
  label,
  scope = "local",
  selectedFilters,
  onFilterChange,
}) {
  const [options, setOptions] = useState([]);

  // Fetch all resource-specific unique values
  const { data: serviceData, isLoading: loadingService } =
    useServiceUniqueFieldValues(field, true, scope);
  const { data: toolData, isLoading: loadingTool } = useToolUniqueFieldValues(
    field,
    true,
    scope
  );
  const { data: datasetData, isLoading: loadingDataset } =
    useDatasetUniqueFieldValues(field, true, scope);
  const { data: documentData, isLoading: loadingDocument } =
    useDocumentUniqueFieldValues(field, true, scope);

  useEffect(() => {
    if (loadingService || loadingTool || loadingDataset || loadingDocument)
      return;

    // Extract unique values dynamically based on field name
    const key = `unique_${field}`;
    const allValues = [
      ...new Set([
        ...(serviceData?.data?.[key] || []),
        ...(toolData?.data?.[key] || []),
        ...(datasetData?.data?.[key] || []),
        ...(documentData?.data?.[key] || []),
      ]),
    ];

    setOptions(allValues);
  }, [
    field,
    serviceData,
    toolData,
    datasetData,
    documentData,
    loadingService,
    loadingTool,
    loadingDataset,
    loadingDocument,
  ]);

  // Current selected values
  const selectedValues = selectedFilters?.[field] || [];

  const handleChange = (event, value) => {
    onFilterChange({ [field]: value });
  };

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{
          px: 1,
          fontSize: "19px",
          backgroundColor: "lightblue",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        By {label}
      </Typography>

      <Divider />
      <CardContent sx={{ p: 2, maxHeight: 200, overflow: "hidden" }}>
        <Autocomplete
          multiple
          fullWidth
          options={options}
          value={selectedValues}
          onChange={handleChange}
          getOptionLabel={(option) => option?.replace(/_/g, " ")}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={option} label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={`Select ${label}`}
              placeholder={label}
            />
          )}
        />
      </CardContent>
      <Divider />
    </Card>
  );
}
