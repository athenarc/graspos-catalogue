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
import { assessmentFunctionalityMenuItems } from "@helpers/MenuItems";

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
