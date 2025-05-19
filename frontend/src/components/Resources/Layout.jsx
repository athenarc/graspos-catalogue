import { useEffect, useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./FiltersLayout/Filters/Utils/useURLFilters";
import FiltersLayout from "./FiltersLayout/Layout";
import GlobalSearchBar from "./FiltersLayout/Filters/GlobalSearchBar";
import SortFilter from "./FiltersLayout/Filters/SortFilter";
import { useDatasets } from "../../queries/dataset";
import { useTools } from "../../queries/tool";
import { useDocuments } from "../../queries/document";
import LicenseAutocompleteFilter from "./FiltersLayout/Filters/LicenseMultiAutocompleteFilter";
import DateFilter from "./FiltersLayout/Filters/DatePickerFilter";
import TagAutoCompleteFilter from "./FiltersLayout/Filters/TagAutocompleteFilter";

function ResourcesTabs({
  selectedResource,
  handleSetSelectedResource,
  filters,
  handleChangeFilters,
  resourcesFetched,
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#f0fcfb",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Stack direction="row" justifyContent="center" pt={0}>
        <GlobalSearchBar
          selectedFilters={filters}
          onFilterChange={handleChangeFilters}
        />
      </Stack>
      <Stack direction="row" justifyContent="center" pt={0}>
        <Tabs
          value={selectedResource}
          onChange={handleSetSelectedResource}
          aria-label="resource tabs"
          centered
        >
          <Tab
            label={
              resourcesFetched?.Datasets?.results !== "undefined"
                ? `Datasets (${resourcesFetched?.Datasets?.results})`
                : "Datasets"
            }
          />
          <Tab
            label={
              resourcesFetched?.Tools?.results !== "undefined"
                ? `Tools (${resourcesFetched?.Tools?.results})`
                : "Tools"
            }
          />
          <Tab
            label={
              resourcesFetched?.Documents?.results !== "undefined"
                ? `Documents (${resourcesFetched?.Documents?.results})`
                : "Documents"
            }
          />
        </Tabs>
      </Stack>
    </Box>
  );
}

export default function ResourcesGridLayout({ user }) {
  const resourceMap = {
    Datasets: 0,
    Tools: 1,
    Documents: 2,
  };
  const [resourcesFetched, setResourcesFetched] = useState(0);
  const [resourceFilter, setResourceFilter] = useState({
    Datasets: { results: 0 },
    Documents: { results: 0 },
    Tools: { results: 0 },
  });
  const {
    filters,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  } = useURLFilters(resourceMap);

  const datasets = useDatasets(filters);
  const tools = useTools(filters);
  const documents = useDocuments(filters);
  useEffect(() => {
    setResourcesFetched((prev) => ({
      ...prev,
      Datasets: { results: datasets?.data?.length ?? 0 },
      Tools: { results: tools?.data?.length ?? 0 },
      Documents: { results: documents?.data?.length ?? 0 },
    }));
  }, [datasets?.data, tools?.data, documents?.data]);

  return (
    <Stack direction="row">
      <FiltersLayout
        selectedResource={selectedResource}
        selectedFilters={filters}
        handleChangeFilters={handleChangeFilters}
        onResetFilters={handleResetFilters}
      />
      <Stack direction="column" sx={{width: "100%"}}>
        <ResourcesTabs
          selectedResource={selectedResource}
          handleSetSelectedResource={handleSetSelectedResource}
          selectedFilters={filters}
          handleChangeFilters={handleChangeFilters}
          resourcesFetched={resourcesFetched}
        />
        <Stack
          direction={{ md: "column", lg: "row" }}
          gap={2}
          justifyContent="center"
          sx={{ p: 2 }}
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
          <DateFilter
            selectedFilters={filters}
            onFilterChange={handleChangeFilters}
          />
          <SortFilter filters={filters} onFilterChange={handleChangeFilters} />
        </Stack>

        <ResourcesGrid
          user={user}
          selectedResource={selectedResource}
          resourceFilter={resourceFilter}
          filters={filters}
          setResourcesFetched={setResourcesFetched}
          datasets={datasets}
          documents={documents}
          tools={tools}
        />
      </Stack>
    </Stack>
  );
}
