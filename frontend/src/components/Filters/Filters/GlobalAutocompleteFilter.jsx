import { useEffect, useState } from "react";
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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { useServiceUniqueFieldValues } from "@queries/service";
import { useToolUniqueFieldValues } from "@queries/tool";
import { useDatasetUniqueFieldValues } from "@queries/dataset";
import { useDocumentUniqueFieldValues } from "@queries/document";

import {
  getLabelForAssessmentFunctionality,
  getLabelForCoveredFields,
  getLabelForCoveredResearchProducts,
  getLabelForEvidenceType,
} from "@helpers/MenuItems";

const mapValuesToLabeledOptions = (values, getLabelFn) =>
  values.map((v) => ({
    value: v,
    label: getLabelFn(v),
  }));

export default function UniqueAutocompleteFieldFilter({
  field,
  label,
  scope = "local",
  selectedFilters,
  onFilterChange,
  tooltip,
}) {
  const [options, setOptions] = useState([]);

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

    const key = `unique_${field}`;

    const allValues = [
      ...new Set([
        ...(serviceData?.data?.[key] || []),
        ...(toolData?.data?.[key] || []),
        ...(datasetData?.data?.[key] || []),
        ...(documentData?.data?.[key] || []),
      ]),
    ];

    switch (field) {
      case "evidence_types":
        setOptions(
          mapValuesToLabeledOptions(allValues, getLabelForEvidenceType)
        );
        break;

      case "assessment_functionalities":
        setOptions(
          mapValuesToLabeledOptions(
            allValues,
            getLabelForAssessmentFunctionality
          )
        );
        break;

      case "covered_fields":
        setOptions(
          mapValuesToLabeledOptions(allValues, getLabelForCoveredFields)
        );
        break;

      case "covered_research_products":
        setOptions(
          mapValuesToLabeledOptions(
            allValues,
            getLabelForCoveredResearchProducts
          )
        );
        break;

      default:
        setOptions(
          allValues.map((v) => ({
            value: v,
            label: v,
          }))
        );
    }
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

  const selectedValues = (selectedFilters?.[field] || []).map((v) => ({
    value: v,
    label: options.find((o) => o.value === v)?.label ?? v,
  }));

  const handleChange = (_, newValue) => {
    onFilterChange({
      [field]: newValue.map((v) => v.value),
    });
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
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          slotProps={{
            listbox: {
              sx: {
                "& .MuiAutocomplete-option": {
                  justifyContent: "flex-start",
                  textAlign: "left",
                },
              },
            },
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...rest } = getTagProps({ index });
              return <Chip key={option.value} label={option.label} {...rest} />;
            })
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
