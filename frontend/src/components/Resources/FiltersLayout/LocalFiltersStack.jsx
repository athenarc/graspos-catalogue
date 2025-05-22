import { Stack } from "@mui/material";
import SortFilter from "./Filters/SortFilter";
import LicenseAutocompleteFilter from "./Filters/LicenseMultiAutocompleteFilter";
import DateFilter from "./Filters/DatePickerFilter";
import TagAutoCompleteFilter from "./Filters/TagAutocompleteFilter";

export default function LocalFiltersStack({
  filters,
  selectedResource,
  handleChangeFilters,
  user,
  isMobile,
}) {
  return (
    <Stack direction="column" gap={2} justifyContent="center" sx={{ p: 4 }}>
      <Stack
        direction="row"
        gap={2}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
        sx={{
          display: { xs: isMobile ? "none" : "flex", md: "flex" },
        }}
      >
        <DateFilter
          selectedFilters={filters}
          onFilterChange={handleChangeFilters}
        />
        <SortFilter filters={filters} onFilterChange={handleChangeFilters} />
      </Stack>

      <Stack
        direction="row"
        gap={2}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
        sx={{
          display: { xs: isMobile ? "none" : "flex", md: "flex" },
        }}
      >
        <LicenseAutocompleteFilter
          selectedFilters={filters}
          selectedResource={selectedResource}
          onFilterChange={handleChangeFilters}
        />
        <TagAutoCompleteFilter
          selectedFilters={filters}
          selectedResource={selectedResource}
          onFilterChange={handleChangeFilters}
        />
      </Stack>

      <Stack
        direction="row"
        gap={2}
        justifyContent="end"
        sx={{
          display: { xs: isMobile ? "none" : "flex", md: "flex" },
        }}
      ></Stack>

      <Stack
        direction="row"
        gap={2}
        flexWrap="wrap"
        alignItems="center"
        justifyContent="end"
        sx={{
          display: { xs: isMobile ? "flex" : "none", md: "none" },
        }}
      >
        <DateFilter
          selectedFilters={filters}
          onFilterChange={handleChangeFilters}
        />
        <SortFilter filters={filters} onFilterChange={handleChangeFilters} />
        <LicenseAutocompleteFilter
          selectedFilters={filters}
          selectedResource={selectedResource}
          onFilterChange={handleChangeFilters}
        />
        <TagAutoCompleteFilter
          selectedFilters={filters}
          selectedResource={selectedResource}
          onFilterChange={handleChangeFilters}
        />
      </Stack>
    </Stack>
  );
}
