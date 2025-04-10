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
  Card,
  useMediaQuery,
  useTheme,
  Fab,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useEffect, useState } from "react";
import { useDatasetLicenses } from "../../queries/dataset";
import { useDocumentLicenses } from "../../queries/document";
import { useToolLicenses } from "../../queries/tool";
import { useLocalStorage } from "./Storage";

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

  const [selectedLicenses, setSelectedLicenses] = useLocalStorage(
    "selectedLicenses",
    {}
  );

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
    licenseData?.length > 0 && (
      <Stack direction="column" spacing="2" p={2} sx={{ mt: 5 }}>
        <Card>
          <Typography variant="h6" sx={{ pl: 1 }}>
            License
          </Typography>
          <Divider />
          <List sx={{ p: 1, backgroundColor: "lightblue" }}>
            {licenseData?.map((license) => (
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
                  sx={{ pr: 1 }}
                />
                <ListItemText primary={license.id} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Card>
      </Stack>
    )
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

function ResourceFilters({ selectedResource, handleChangeFilters }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 12 }}>
      <LicenseFilter
        selectedResource={selectedResource}
        onFilterChange={handleChangeFilters}
      />
    </Stack>
  );
}

export default function ResourcesFiltersDrawer({
  selectedResource,
  handleChangeFilters,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Floating button for mobile only */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 125,
            right: 20,
            width: 40,
            height: 40,
            zIndex: theme.zIndex.drawer + 2,
          }}
        >
          <FilterAltIcon />
        </Fab>
      )}

      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? mobileOpen : true}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        <ResourceFilters
          selectedResource={selectedResource}
          handleChangeFilters={handleChangeFilters}
        />
      </Drawer>
    </>
  );
}
