import { Stack } from "@mui/material";
import GrasposVerifiedFilter from "./Filters/GrasposFilterSwitch";
import ResourcesFiltersDrawer from "./GlobalFiltersDrawer";
import ScopeFacetFilter from "./Filters/ScopeFacetFilter";

function ResourceFilters({
  handleChangeFilters,
  selectedFilters,
  selectedResource,
}) {
  return (
    <Stack direction="column" spacing={2} sx={{ flexGrow: 1, px: 2 }}>
      <GrasposVerifiedFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <ScopeFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
    </Stack>
  );
}

export default function FiltersLayout({
  selectedResource,
  handleChangeFilters,
  onResetFilters,
  selectedFilters,
  isMobile,
  theme,
}) {
  return (
    <ResourcesFiltersDrawer
      isMobile={isMobile}
      theme={theme}
      onResetFilters={onResetFilters}
      ResourceFilters={ResourceFilters}
      resourceFiltersProps={{
        onResetFilters,
        selectedResource,
        handleChangeFilters,
        selectedFilters,
      }}
    />
  );
}
