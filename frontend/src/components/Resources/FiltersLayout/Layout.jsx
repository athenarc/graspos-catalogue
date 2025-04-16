import { Stack } from "@mui/material";
import GrasposVerifiedFilter from "./Filters/GrasposFilterSwitch";
import LicenseFilter from "./Filters/LicenseFacetFilter";
import DateFilter from "./Filters/DatePickerFilter";
import SortFilter from "./Filters/SortFilter";
import ResourcesFiltersDrawer from "./FilterDrawer";
import TagAutocompleteFilter from "./Filters/TagAutocompleteFilter";
import TextFilter from "./Filters/FullTextSearchInput";

function ResourceFilters({
  selectedResource,
  handleChangeFilters,
  selectedFilters,
}) {
  return (
    <Stack direction="column" spacing={2} p={2} sx={{ flexGrow: 1 }}>
      <GrasposVerifiedFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <TextFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <LicenseFilter
        selectedFilters={selectedFilters}
        selectedResource={selectedResource}
        onFilterChange={handleChangeFilters}
      />
      <TagAutocompleteFilter
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

export default function FiltersLayout({
  selectedResource,
  handleChangeFilters,
  onResetFilters,
  selectedFilters,
}) {
  return (
    <ResourcesFiltersDrawer
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
