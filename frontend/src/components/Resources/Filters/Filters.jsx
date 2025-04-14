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
  Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useCallback, useEffect, useState } from "react";
import { useDatasetLicenses } from "../../../queries/dataset";
import { useDocumentLicenses } from "../../../queries/document";
import { useToolLicenses } from "../../../queries/tool";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export function DateFilter({ selectedFilters, onFilterChange }) {
  const { dateRange } = selectedFilters || {};

  // Extract the start and end dates directly from selectedFilters
  const startDate = dateRange?.startDate ? new Date(dateRange.startDate) : null;
  const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : null;

  // Handle filter change when date range changes
  const handleDateRangeChange = useCallback(
    (newStartDate, newEndDate) => {
      // Only call onFilterChange if there is a change in the date range
      const hasChanged =
        (newStartDate &&
          newStartDate.toISOString() !== selectedFilters.dateRange.startDate) ||
        (newEndDate &&
          newEndDate.toISOString() !== selectedFilters.dateRange.endDate);

      if (hasChanged) {
        onFilterChange({
          dateRange: {
            startDate: newStartDate ? newStartDate.toISOString() : null,
            endDate: newEndDate ? newEndDate.toISOString() : null,
          },
        });
      }
    },
    [selectedFilters, onFilterChange] // Dependency on selectedFilters
  );

  useEffect(() => {
    // If the selectedFilters.dateRange is changed externally, no need to update state
    // This effect ensures that the component is properly synced with the parent
  }, [selectedFilters]);

  return (
    <Stack direction="column" spacing={2} p={2}>
      <Card>
        <Typography variant="h6" sx={{ pl: 1 }}>
          Publication Date
        </Typography>
        <Divider />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2} p={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => handleDateRangeChange(newValue, endDate)}
              disableFuture // Optional: Disable future dates if needed
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) =>
                handleDateRangeChange(startDate, newValue)
              }
              disableFuture // Optional: Disable future dates if needed
            />
          </Stack>
        </LocalizationProvider>
        <Divider />
      </Card>
    </Stack>
  );
}

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
    <Card sx={{ m: 2, backgroundColor: "lightblue" }}>
      <Stack direction="column" spacing={2} p={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleSortChange("views")}
          sx={{ backgroundColor: "white" }}
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
          sx={{ backgroundColor: "white" }}
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
          sx={{ backgroundColor: "white" }}
        >
          Sort by Dates{" "}
          {filters.sortField === "dates"
            ? filters.sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </Button>
      </Stack>
    </Card>
  );
}
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
function GrasposVerifiedFilter({ selectedFilters, onFilterChange }) {
  const handleSwitch = (event) => {
    onFilterChange({ graspos: event.target.checked });
  };

  return (
    <Card sx={{ m: 2 }}>
      <Stack direction="row" justifyContent="start" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={!!selectedFilters.graspos}
              onChange={handleSwitch}
              color="primary"
            />
          }
          label="GraspOS Verified"
          sx={{ p: 2, mr: 0 }}
        />
        <Tooltip title="By toggling on resources that are only part of GraspOS communities will be displayed">
          <InfoOutlinedIcon fontSize="small" />
        </Tooltip>
      </Stack>
    </Card>
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
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: "400px",
              md: "500px",
            },
          }}
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
      <DateFilter
        selectedFilters={selectedFilters}
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
            top: 124,
            right: 24,
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
