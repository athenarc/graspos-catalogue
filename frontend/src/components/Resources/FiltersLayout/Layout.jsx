import { Stack } from "@mui/material";
import GrasposVerifiedFilter from "./Filters/GrasposFilterSwitch";
import DateFilter from "./Filters/DatePickerFilter";
import ResourcesFiltersDrawer from "./FilterDrawer";
import TagAutocompleteFilter from "./Filters/TagAutocompleteFilter";
import LicenseAutocompleteFilter from "./Filters/LicenseMultiAutocompleteFilter";

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
      <LicenseAutocompleteFilter
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
