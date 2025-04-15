import {
  Autocomplete,
  TextField,
  Card,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { useDatasetUniqueFieldValues } from "../../../../queries/dataset";
import { useDocumentUniqueFieldValues } from "../../../../queries/document";
import { useToolUniqueFieldValues } from "../../../../queries/tool";
import { useEffect, useState } from "react";

export default function KeywordAutocompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [keywordOptions, setKeywordOptions] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState(
    selectedFilters?.keywords || []
  );

  const { data: datasetUniqueFieldValues, isLoading: isDatasetLoading } =
    useDatasetUniqueFieldValues("keywords", selectedResource === 0);
  const { data: documentKeywordsData, isLoading: isDocumentLoading } =
    useDocumentUniqueFieldValues("keywords", selectedResource === 2);
  const { data: toolKeywordsData, isLoading: isToolLoading } =
    useToolUniqueFieldValues("keywords", selectedResource === 1);

  useEffect(() => {
    if (isDatasetLoading || isDocumentLoading || isToolLoading) return;

    const resourceKeywords =
      selectedResource === 0
        ? datasetUniqueFieldValues?.data?.unique_keywords
        : selectedResource === 2
        ? documentKeywordsData?.data?.unique_keywords
        : toolKeywordsData?.data?.unique_keywords;

    setKeywordOptions(resourceKeywords || []);
  }, [
    selectedResource,
    datasetUniqueFieldValues,
    documentKeywordsData,
    toolKeywordsData,
    isDatasetLoading,
    isDocumentLoading,
    isToolLoading,
  ]);

  useEffect(() => {
    if (selectedFilters?.keywords) {
      const validKeywords = selectedFilters.keywords.filter((keyword) =>
        keywordOptions.includes(keyword)
      );

      if (JSON.stringify(validKeywords) !== JSON.stringify(selectedKeywords)) {
        setSelectedKeywords(validKeywords);
        onFilterChange({ keywords: validKeywords });
      }
    }
  }, [selectedFilters, keywordOptions]);

  const handleChange = (event, value) => {
    setSelectedKeywords(value);
    onFilterChange({ keywords: value });
  };

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{ pl: 1, backgroundColor: "lightblue", color: "white" }}
      >
        Keywords
      </Typography>
      <Divider />
      <Autocomplete
        multiple
        options={keywordOptions}
        value={selectedKeywords}
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
            placeholder="Select keywords"
          />
        )}
        sx={{ p: 2 }}
      />
      <Divider />
    </Card>
  );
}
