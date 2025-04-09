import {
  Divider,
  Drawer,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useDatasetLicenses } from "../../queries/dataset";
import { useDocumentLicenses } from "../../queries/document";
import { useToolLicenses } from "../../queries/tool";

function LicenseFilter({ selectedResource, onFilterChange }) {
  const [licenseData, setLicenseData] = useState([]);

  const { data: datasetLicenseData, isLoading: isDatasetLoading } =
    useDatasetLicenses(selectedResource == 0);
  const { data: documentLicenseData, isLoading: isDocumentLoading } =
    useDocumentLicenses(selectedResource == 1);
  const { data: toolLicenseData, isLoading: isToolLoading } = useToolLicenses(
    selectedResource == 2
  );

  useEffect(() => {
    if (isDatasetLoading || isDocumentLoading || isToolLoading) return;
    setLicenseData(
      selectedResource == 0
        ? datasetLicenseData?.data?.unique_licenses
        : selectedResource == 1
        ? documentLicenseData?.data?.unique_licenses
        : toolLicenseData?.data?.unique_licenses
    );
    setSelectedLicenses([]);
  }, [
    selectedResource,
    datasetLicenseData,
    documentLicenseData,
    toolLicenseData,
    isDatasetLoading,
    isDocumentLoading,
    isToolLoading,
  ]);

  const [selectedLicenses, setSelectedLicenses] = useState({});

  const handleToggle = (licenseId) => {
    setSelectedLicenses((prev) => ({
      ...prev,
      [licenseId]: !prev[licenseId],
    }));
  };

  useEffect(() => {
    onFilterChange(selectedLicenses);
  }, [selectedLicenses]);

  return (
    <Stack direction="column">
      <Typography variant="h6" gutterBottom>
        License
      </Typography>
      <Divider />

      <List>
        {licenseData?.map((license) => (
          <ListItem key={license.id} onClick={() => handleToggle(license.id)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={!!selectedLicenses[license.id]}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={license.id} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export function ResourcesFilterBar({
  resourceFilter,
  handleResourceFilterChange,
}) {
  return (
    <Stack sx={{ p: 2 }}>
      <Grid size={12} sx={{ margin: "auto", textAlign: "left" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          placeholder="Search Resource.."
          size="small"
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
        />
      </Grid>
    </Stack>
  );
}

export default function ResourcesFilters({
  selectedResource,
  handleChangeFilters,
}) {
  return (
    <Drawer
      sx={{
        width: 200,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack direction="column" spacing={2} sx={{ marginTop: "15vh" }}>
        <LicenseFilter
          selectedResource={selectedResource}
          onFilterChange={handleChangeFilters}
        />
      </Stack>
      <Divider />
    </Drawer>
  );
}
