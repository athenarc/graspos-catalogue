import {
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Card,
} from "@mui/material";
import { useDatasetUniqueFieldValues } from "../../../../queries/dataset";
import { useDocumentUniqueFieldValues } from "../../../../queries/document";
import { useToolUniqueFieldValues } from "../../../../queries/tool";
import { useEffect, useState } from "react";

export default function LicenseFilter({
  selectedResource,
  onFilterChange,
  selectedFilters,
}) {
  const [licenseData, setLicenseData] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState(
    selectedFilters?.licenses || {}
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

    setLicenseData(resourceLicenseData || []);
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
      const validSelectedLicenses = Object.keys(
        selectedFilters.licenses
      ).reduce((acc, licenseId) => {
        const licenseExists = licenseData.some(
          (license) => license.id === licenseId
        );
        if (licenseExists) {
          acc[licenseId] = selectedFilters.licenses[licenseId];
        }
        return acc;
      }, {});

      if (
        JSON.stringify(validSelectedLicenses) !==
        JSON.stringify(selectedLicenses)
      ) {
        setSelectedLicenses(validSelectedLicenses);
        onFilterChange({ licenses: validSelectedLicenses });
      }
    }
  }, [selectedFilters, licenseData, selectedLicenses, onFilterChange]);

  const handleToggle = (licenseId) => {
    const updatedLicenses = {
      ...selectedLicenses,
      [licenseId]: !selectedLicenses[licenseId],
    };
    setSelectedLicenses(updatedLicenses);
    onFilterChange({ licenses: updatedLicenses });
  };

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{ pl: 1, backgroundColor: "lightblue", color: "white" }}
      >
        License
      </Typography>
      <Divider />
      <List sx={{ px: 2, py: 1, overflow: "auto", maxHeight: "20dvh" }}>
        {licenseData.length > 0 ? (
          licenseData.map((license) => (
            <ListItem
              key={license.id}
              onClick={() => handleToggle(license.id)}
              sx={{ p: 0 }}
            >
              <Checkbox
                edge="start"
                checked={!!selectedLicenses[license.id]}
                tabIndex={-1}
                disableRipple
                sx={{ p: 1 }}
              />
              <ListItemText primary={license.id} sx={{ cursor: "pointer" }} />
            </ListItem>
          ))
        ) : (
          <Typography sx={{ p: 2 }}></Typography>
        )}
      </List>
      <Divider />
    </Card>
  );
}
