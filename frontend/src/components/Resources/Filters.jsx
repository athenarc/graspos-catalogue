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
  Button,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useEffect, useState } from "react";
import { useDatasetLicenses } from "../../queries/dataset";
import { useDocumentLicenses } from "../../queries/document";
import { useToolLicenses } from "../../queries/tool";

export function LicenseFilter({
  selectedResource,
  onFilterChange,
  selectedFilters,
}) {
  const [licenseData, setLicenseData] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState(
    selectedFilters?.licenses || {}
  );

  const { data: datasetLicenseData, isLoading: isDatasetLoading } =
    useDatasetLicenses(selectedResource === 0);
  const { data: documentLicenseData, isLoading: isDocumentLoading } =
    useDocumentLicenses(selectedResource === 1);
  const { data: toolLicenseData, isLoading: isToolLoading } = useToolLicenses(
    selectedResource === 2
  );

  useEffect(() => {
    if (isDatasetLoading || isDocumentLoading || isToolLoading) return;

    // Set the license data based on the selected resource
    const resourceLicenseData =
      selectedResource === 0
        ? datasetLicenseData?.data?.unique_licenses
        : selectedResource === 1
        ? documentLicenseData?.data?.unique_licenses
        : toolLicenseData?.data?.unique_licenses;

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
      // Filter out invalid licenses from selectedFilters.licenses
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

      // Only update the selectedLicenses if there is a change
      if (
        JSON.stringify(validSelectedLicenses) !==
        JSON.stringify(selectedLicenses)
      ) {
        setSelectedLicenses(validSelectedLicenses); // Update only if the licenses are different
        onFilterChange({ licenses: validSelectedLicenses }); // Update the parent with valid licenses
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
    licenseData.length > 0 && (
      <Stack direction="column" spacing={2} p={2}>
        <Card>
          <Typography variant="h6" sx={{ pl: 1 }}>
            License
          </Typography>
          <Divider />
          <List sx={{ p: 1, backgroundColor: "lightblue" }}>
            {licenseData.map((license) => (
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

export function ResourcesFilterSearchBar({
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

function ResourceFilters({
  selectedResource,
  handleChangeFilters,
  selectedFilters,
}) {
  return (
    <Stack direction="column" spacing={2}>
      <LicenseFilter
        selectedFilters={selectedFilters}
        selectedResource={selectedResource}
        onFilterChange={handleChangeFilters}
      />
    </Stack>
  );
}

export default function ResourcesFiltersDrawer({
  selectedResource,
  handleChangeFilters,
  onResetFilters,
  selectedFilters,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
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
          height: "100%",
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
        <Stack
          direction="column"
          spacing={2}
          sx={{ height: "100%", justifyContent: "space-between", mt: 12 }} // Ensure content fills full height
        >
          <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
            <ResourceFilters
              selectedFilters={selectedFilters}
              selectedResource={selectedResource}
              handleChangeFilters={handleChangeFilters}
            />
          </Stack>

          {/* Reset Filters Button at the bottom */}
          <Stack direction="column" spacing={2} sx={{ p: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onResetFilters(false)}
            >
              Reset Filters
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
