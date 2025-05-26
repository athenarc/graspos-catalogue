import { Autocomplete, TextField, Chip } from "@mui/material";
import { useDatasetUniqueFieldValues } from "../../../../queries/dataset";
import { useDocumentUniqueFieldValues } from "../../../../queries/document";
import { useToolUniqueFieldValues } from "../../../../queries/tool";
import { useEffect, useState } from "react";

export default function LicenseAutocompleteFilter({
  selectedResource,
  selectedFilters,
  onFilterChange,
}) {
  const [licenseOptions, setLicenseOptions] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState(
    Object.keys(selectedFilters?.licenses || {})
  );

  const { data: datasetLicenseData, isLoading: isDatasetLoading } =
    useDatasetUniqueFieldValues("license", selectedResource === 0);
  const { data: documentLicenseData, isLoading: isDocumentLoading } =
    useDocumentUniqueFieldValues("license", selectedResource === 2);
  const { data: toolLicenseData, isLoading: isToolLoading } =
    useToolUniqueFieldValues("license", selectedResource === 1);

  useEffect(() => {
    if (isDatasetLoading || isDocumentLoading || isToolLoading) return;

    const resourceLicenseData =
      selectedResource === 0
        ? datasetLicenseData?.data?.unique_license
        : selectedResource === 2
        ? documentLicenseData?.data?.unique_license
        : toolLicenseData?.data?.unique_license;

    const ids = resourceLicenseData?.map((l) => l.id) || [];
    setLicenseOptions(ids);
  }, [
    selectedResource,
    datasetLicenseData,
    documentLicenseData,
    toolLicenseData,
    isDatasetLoading,
    isDocumentLoading,
    isToolLoading,
  ]);

  useEffect(() => {
    if (selectedFilters?.licenses) {
      const valid = Object.keys(selectedFilters.licenses).filter((id) =>
        licenseOptions.includes(id)
      );

      if (JSON.stringify(valid) !== JSON.stringify(selectedLicenses)) {
        setSelectedLicenses(valid);
        onFilterChange({
          licenses: valid.reduce((acc, id) => {
            acc[id] = true;
            return acc;
          }, {}),
        });
      }
    }
  }, [selectedFilters, licenseOptions]);

  const handleChange = (event, value) => {
    setSelectedLicenses(value);
    const updated = value.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
    onFilterChange({ licenses: updated });
  };

  return (
    <Autocomplete
      multiple
      fullWidth
      options={licenseOptions}
      value={selectedLicenses}
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
          placeholder="Select licenses"
        />
      )}
    />
  );
}
