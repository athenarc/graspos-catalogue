import {
  Autocomplete,
  Chip,
  Divider,
  Typography,
  Stack,
  TextField,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useServiceUniqueFieldValues } from "@queries/service";
import { useToolUniqueFieldValues } from "@queries/tool";
import { useDatasetUniqueFieldValues } from "@queries/dataset";
import { useDocumentUniqueFieldValues } from "@queries/document";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
<Tooltip title="The research entities of which the assessment can be supported by the resources.">
  <HelpOutlineIcon />
</Tooltip>;

const mapEvidenceTypes = (options) => {
  return options.map((option) => {
    switch (option) {
      case "narratives":
        return "Narratives";
      case "indicators":
        return "Indicators";
      case "list_of_contributions":
        return "List Of Contributions";
      case "badges":
        return "Badges";
      case "other":
        return "Other";
      default:
        return option;
    }
  });
};

const mapOptionEvidenceValueToType = (option) => {
  switch (option) {
    case "narratives":
      return "Narratives";
    case "indicators":
      return "Indicators";
    case "list_of_contributions":
      return "List Of Contributions";
    case "badges":
      return "Badges";
    case "other":
      return "Other";
    default:
      return option;
  }
};

export default function UniqueAutocompleteFieldFilter({
  field,
  label,
  scope = "local",
  selectedFilters,
  onFilterChange,
  tooltip,
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1, backgroundColor: "lightblue", color: "white" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "19px",
            backgroundColor: "lightblue",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          By {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip}>
            <HelpOutlineIcon sx={{ color: "white" }} />
          </Tooltip>
        )}
      </Stack>
      <Divider />
      <CardContent sx={{ p: 2, maxHeight: 200, overflow: "hidden" }}>
        <Autocomplete
          multiple
          fullWidth
          options={options}
          value={selectedValues}
          onChange={handleChange}
          getOptionLabel={(option) => mapOptionEvidenceValueToType(option)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option}
                label={mapOptionEvidenceValueToType(option)}
                {...getTagProps({ index })}
              />
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
