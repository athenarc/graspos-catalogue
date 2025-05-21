import { Stack, Button } from "@mui/material";
import SortFilter from "./Filters/SortFilter";
import LicenseAutocompleteFilter from "./Filters/LicenseMultiAutocompleteFilter";
import DateFilter from "./Filters/DatePickerFilter";
import TagAutoCompleteFilter from "./Filters/TagAutocompleteFilter";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

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
      >
        {user && (
          <Button
            color="primary"
            variant="outlined"
            endIcon={<AddIcon />}
            component={Link}
            to={
              selectedResource == 0
                ? "/dataset/add"
                : selectedResource === 1
                ? "/tool/add"
                : "/document/add"
            }
            sx={{
              backgroundColor: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {selectedResource == 0
              ? "Add Dataset"
              : selectedResource === 1
              ? "Add Tool"
              : "Add Document"}
          </Button>
        )}
      </Stack>

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
