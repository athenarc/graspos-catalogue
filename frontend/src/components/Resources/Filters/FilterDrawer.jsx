import {
  Drawer,
  Stack,
  useMediaQuery,
  useTheme,
  Fab,
  Button,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";
import GrasposVerifiedFilter from "./GrasposFilterSwitch";
import LicenseFilter from "./LicenseFacetFilter";
import DateFilter from "./DatePickerFilter";
import SortFilter from "./SortFilter";

function ResourceFilters({
  selectedResource,
  handleChangeFilters,
  selectedFilters,
}) {
  return (
    <>
      <Stack direction="column" spacing={2} p={2}>
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
    </>
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
          width: 350,
          height: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 350,
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
