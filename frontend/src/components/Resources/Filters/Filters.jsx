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
  Switch,
  FormControlLabel,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useEffect, useState } from "react";
import { useDatasetLicenses } from "../../../queries/dataset";
import { useDocumentLicenses } from "../../../queries/document";
import { useToolLicenses } from "../../../queries/tool";

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
    useDocumentLicenses(selectedResource === 2);
  const { data: toolLicenseData, isLoading: isToolLoading } = useToolLicenses(
    selectedResource === 1
  );

  useEffect(() => {
    if (isDatasetLoading || isDocumentLoading || isToolLoading) return;

    const resourceLicenseData =
      selectedResource === 0
        ? datasetLicenseData?.data?.unique_licenses
        : selectedResource === 2
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
                <ListItemText primary={license.id} sx={{ cursor: "pointer" }} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Card>
      </Stack>
    )
  );
}

function SortFilter({ filters, onFilterChange }) {
  const handleSortChange = (field) => {
    const newDirection =
      filters.sortField === field && filters.sortDirection === "asc"
        ? "desc"
        : "asc";
    onFilterChange({ sortField: field, sortDirection: newDirection });
  };

  return (
    <Stack direction="column" spacing={2} p={2}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleSortChange("views")}
      >
        Sort by Views{" "}
        {filters.sortField === "views"
          ? filters.sortDirection === "asc"
            ? "↑"
            : "↓"
          : ""}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleSortChange("downloads")}
      >
        Sort by Downloads{" "}
        {filters.sortField === "downloads"
          ? filters.sortDirection === "asc"
            ? "↑"
            : "↓"
          : ""}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleSortChange("dates")}
      >
        Sort by Dates{" "}
        {filters.sortField === "dates"
          ? filters.sortDirection === "asc"
            ? "↑"
            : "↓"
          : ""}
      </Button>
    </Stack>
  );
}

function GrasposVerifiedFilter({ selectedFilters, onFilterChange }) {
  const handleSwitch = (event) => {
    onFilterChange({ graspos: event.target.checked });
  };

  return (
    <Stack direction="column" spacing={2} p={2}>
      <Card>
        <FormControlLabel
          control={
            <Switch
              checked={!!selectedFilters.graspos}
              onChange={handleSwitch}
              color="primary"
            />
          }
          label="GraspOS Verified"
          sx={{ p: 2 }}
        />
      </Card>
    </Stack>
  );
}
export function ResourcesFilterSearchBar({
  resourceFilter,
  handleResourceFilterChange,
}) {
  return (
    <Stack sx={{ p: 2 }}>
      <Grid sx={{ margin: "auto", textAlign: "left" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          placeholder="Search Resource, abstract.."
          size="small"
          fullWidth
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
          sx={{ minWidth: "400px" }}
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
    <Stack direction="column">
      <GrasposVerifiedFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <LicenseFilter
        selectedFilters={selectedFilters}
        selectedResource={selectedResource}
        onFilterChange={handleChangeFilters}
      />
      <SortFilter
        filters={selectedFilters}
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
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
          keepMounted: true,
        }}
      >
        <Stack direction="column" sx={{ height: "100%", mt: 7.5 }}>
          <Stack direction="column" sx={{ flexGrow: 1 }}>
            <ResourceFilters
              selectedFilters={selectedFilters}
              selectedResource={selectedResource}
              handleChangeFilters={handleChangeFilters}
            />
          </Stack>

          <Stack direction="column" sx={{ p: 2 }}>
            <Button
              variant="contained"
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
