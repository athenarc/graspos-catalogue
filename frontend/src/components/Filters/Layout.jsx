import { Stack } from "@mui/material";
import ResourcesFiltersDrawer from "./GlobalFiltersDrawer";
import ScopeFacetFilter from "./Filters/ScopeFacetFilter";
import GeographicalCoverageFacetFilter from "./Filters/GeographicalCoverageFacetFilter";
import AssessmentFacetFilter from "./Filters/AssessmentSubjectFilter";
import UniqueAutocompleteFieldFilter from "./Filters/GlobalAutocompleteFilter";

function ResourceFilters({ handleChangeFilters, selectedFilters }) {
  return (
    <Stack direction="column" spacing={2} sx={{ flexGrow: 1, px: 2 }}>
      <ScopeFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <AssessmentFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <GeographicalCoverageFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="assessment_values"
        label="Assessment Values"
        tooltip="Values that can be supported by a research assessment event using the resources."
        scope="local"
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="evidence_types"
        label="Evidence Types"
        scope="local"
        tooltip="The types of assessment evidence that the resources is offering or leveraging."
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="covered_fields"
        label="Covered Fields"
        scope="local"
        tooltip="The fields that the resources cover."
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="covered_research_products"
        label="Covered Research Products"
        scope="local"
        tooltip="The research products that the resources cover."
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
