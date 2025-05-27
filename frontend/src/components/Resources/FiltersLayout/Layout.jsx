import { Stack } from "@mui/material";
import ResourcesFiltersDrawer from "./GlobalFiltersDrawer";
import ScopeFacetFilter from "./Filters/ScopeFacetFilter";
import GeographicalCoverageFacetFilter from "./Filters/GeographicalCoverageFacetFilter";
import AssessmentFacetFilter from "./Filters/AssessmentSubjectFilter";

function ResourceFilters({ handleChangeFilters, selectedFilters }) {
  return (
    <Stack direction="column" spacing={2} sx={{ flexGrow: 1, px: 2 }}>
      <ScopeFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <GeographicalCoverageFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <AssessmentFacetFilter
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
