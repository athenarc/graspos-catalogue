import { useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./FiltersLayout/Filters/Utils/useURLFilters";
import FiltersLayout from "./FiltersLayout/Layout";
import GlobalSearchBar from "./FiltersLayout/Filters/GlobalSearchBar";

function ResourcesTabs({ selectedResource, handleSetSelectedResource }) {
  return (
    <Box
      justifyContent="center"
      sx={{
        backgroundColor: "#f0fcfb",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
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
        />
        <Stack direction="row">
          <GlobalSearchBar
            selectedResource={selectedResource}
            selectedFilters={filters}
            onFilterChange={handleChangeFilters}
            onResetFilters={handleResetFilters}
          />
        </Stack>
        <ResourcesGrid
          user={user}
          selectedResource={selectedResource}
          resourceFilter={resourceFilter}
          filters={filters}
        />
      </Stack>
    </Stack>
  );
}
