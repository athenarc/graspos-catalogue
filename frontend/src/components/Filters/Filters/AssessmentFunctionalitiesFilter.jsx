import { useEffect, useState } from "react";

import {
  Autocomplete,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

import { useServiceUniqueFieldValues } from "@queries/service";
import { useToolUniqueFieldValues } from "@queries/tool";

const assessmentFunctionalityMenuItems = [
  {
    value: "scholarly_data_enrichment_missing_attributes",
    label: "Scholarly data enrichment: Missing attributes",
  },
  {
    value: "scholarly_data_enrichment_indicators",
    label: "Scholarly data enrichment: Indicators",
  },
  {
    value: "scholarly_data_enrichment_semantics",
    label: "Scholarly data enrichment: Missing links & semantics",
  },
  {
    value: "open_science_monitoring_researchers",
    label: "Open Science monitoring: Researchers",
  },
  {
    value: "open_science_monitoring_institutions",
    label: "Open Science monitoring: Institutions",
  },
  {
    value: "open_science_monitoring_countries",
    label: "Open Science monitoring: Countries",
  },
  {
    value: "open_science_monitoring_general",
    label: "Open Science monitoring: General",
  },
  {
    value: "data",
    label: "Data",
  },
  {
    value: "other",
    label: "Other",
  },
];
function getLabelForAssessmentFunctionality(value) {
  const item = assessmentFunctionalityMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}

export default function AssessmentFunctionalitiesFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [
    assessmentFunctionalitiesOptions,
    setAssessmentFunctionalitiesOptions,
  ] = useState([]);
  const [
    selectedAssessmentFunctionalities,
    setSelectedAssessmentFunctionalities,
  ] = useState([]);

  const { data: toolAssessmentFunctionalitiesData, isLoading: isToolLoading } =
    useToolUniqueFieldValues(
      "assessment_functionalities",
      selectedResource === 1,
      "local"
    );
  const { data: servicesAssessmentFunctionalitiesData, isLoading } =
    useServiceUniqueFieldValues(
      "assessment_functionalities",
      selectedResource === 3,
      "local"
    );

  useEffect(() => {
    if (isLoading || isToolLoading) return;
    const resourceAssessmentFunctionalitiesData =
      selectedResource === 3
        ? servicesAssessmentFunctionalitiesData?.data
            ?.unique_assessment_functionalities
        : selectedResource === 1
        ? toolAssessmentFunctionalitiesData?.data
            ?.unique_assessment_functionalities
        : [];
    const ids = resourceAssessmentFunctionalitiesData?.map((t) => t) || [];
    setAssessmentFunctionalitiesOptions(ids);
  }, [
    selectedResource,
    servicesAssessmentFunctionalitiesData,
    toolAssessmentFunctionalitiesData,
    isLoading,
    isToolLoading,
  ]);

  useEffect(() => {
    setSelectedAssessmentFunctionalities(
      selectedFilters?.assessment_functionalities || []
    );
  }, [selectedFilters]);

  const handleChange = (event, value) => {
    setSelectedAssessmentFunctionalities(value);
    onFilterChange({ assessment_functionalities: value });
  };

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        Assessment Functionalities
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Autocomplete
        multiple
        fullWidth
        options={assessmentFunctionalitiesOptions}
        value={selectedAssessmentFunctionalities}
        onChange={handleChange}
        getOptionLabel={(option) => getLabelForAssessmentFunctionality(option)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...restTagProps } = getTagProps({ index });
            return (
              <Chip
                label={getLabelForAssessmentFunctionality(option)}
                {...restTagProps}
                key={option}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Select assessment functionalities"
          />
        )}
        disabled={selectedResource !== 3 && selectedResource !== 1}
      />
    </Stack>
  );
}
