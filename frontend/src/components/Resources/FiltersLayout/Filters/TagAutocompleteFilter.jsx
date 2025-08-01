import {
  Autocomplete,
  TextField,
  Chip,
  Paper,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import { useDatasetUniqueFieldValues } from "../../../../queries/dataset";
import { useDocumentUniqueFieldValues } from "../../../../queries/document";
import { useToolUniqueFieldValues } from "../../../../queries/tool";
import { useEffect, useState } from "react";
import { useServiceUniqueFieldValues } from "../../../../queries/service";

export default function TagAutoCompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    selectedFilters?.keywords || []
  );

  const { data: datasetUniqueFieldValues, isLoading: isDatasetLoading } =
    useDatasetUniqueFieldValues("keywords", selectedResource === 0);
  const { data: documentKeywordsData, isLoading: isDocumentLoading } =
    useDocumentUniqueFieldValues("keywords", selectedResource === 2);
  const { data: toolKeywordsData, isLoading: isToolLoading } =
    useToolUniqueFieldValues("keywords", selectedResource === 1);
  const { data: serviceKeywordsData, isLoading: isServiceLoading } =
    useServiceUniqueFieldValues("tags", selectedResource === 3);

  useEffect(() => {
    if (
      isDatasetLoading ||
      isDocumentLoading ||
      isToolLoading ||
      isServiceLoading
    )
      return;

    const resourceKeywords =
      selectedResource === 0
        ? datasetUniqueFieldValues?.data?.unique_keywords
        : selectedResource === 2
        ? documentKeywordsData?.data?.unique_keywords
        : selectedResource === 1
        ? toolKeywordsData?.data?.unique_keywords
        : serviceKeywordsData?.data?.unique_tags;

    setTagOptions(resourceKeywords || []);
  }, [
    selectedResource,
    datasetUniqueFieldValues,
    documentKeywordsData,
    toolKeywordsData,
    serviceKeywordsData,
    isDatasetLoading,
    isDocumentLoading,
    isToolLoading,
    isServiceLoading,
  ]);

  useEffect(() => {
    if (selectedFilters?.tags) {
      const validKeywords = selectedFilters.tags.filter((tag) =>
        tagOptions.includes(tag)
      );

      if (JSON.stringify(validKeywords) !== JSON.stringify(selectedTags)) {
        setSelectedTags(validKeywords);
        onFilterChange({ tags: validKeywords });
      }
    }
  }, [selectedFilters, tagOptions]);

  const handleChange = (event, value) => {
    setSelectedTags(value);
    onFilterChange({ tags: value });
  };

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        Tags
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Autocomplete
        multiple
        fullWidth
        options={tagOptions}
        value={selectedTags}
        onChange={handleChange}
        getOptionLabel={(option) => option}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" placeholder="Select tags" />
        )}
      />
    </Stack>
  );
}
