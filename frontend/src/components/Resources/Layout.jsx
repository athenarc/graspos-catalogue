import { useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./FiltersLayout/Filters/Utils/useURLFilters";
import FiltersLayout from "./FiltersLayout/Layout";
import GlobalSearchBar from "./FiltersLayout/Filters/GlobalSearchBar";

function ResourcesTabs({
  selectedResource,
  handleSetSelectedResource,
  filters,
  handleChangeFilters,
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
          <Tab label="Datasets" />
          <Tab label="Tools" />
          <Tab label="Documents" />
        </Tabs>
      </Stack>
    </Box>
  );
}

export default function ResourcesGridLayout({ user }) {
  const resourceMap = {
    datasets: 0,
    tools: 1,
    documents: 2,
  };

  const [resourceFilter, setResourceFilter] = useState("");
  const {
    filters,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  } = useURLFilters(resourceMap);

  return (
    <Stack direction="row">
      <FiltersLayout
        selectedResource={selectedResource}
        selectedFilters={filters}
        handleChangeFilters={handleChangeFilters}
        onResetFilters={handleResetFilters}
      />
      <Stack direction="column" sx={{ width: "100%" }}>
        <ResourcesTabs
          selectedResource={selectedResource}
          handleSetSelectedResource={handleSetSelectedResource}
          selectedFilters={filters}
          handleChangeFilters={handleChangeFilters}
        />
        <Stack
          direction="column"
          sx={{ maxHeight: "82.4dvh", overflowY: "auto" }}
        >
          <ResourcesGrid
            user={user}
            selectedResource={selectedResource}
            resourceFilter={resourceFilter}
            filters={filters}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
