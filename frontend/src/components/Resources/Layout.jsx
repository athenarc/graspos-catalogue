import { useEffect, useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesFilters, { ResourcesFilterSearchBar } from "./Filters/Filters";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./Filters/useURLFilters";

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
    documents: 2,
    tools: 1,
  };
  const [resourceFilter, setResourceFilter] = useState("");
  const {
    filters,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  } = useURLFilters(resourceMap);

  const handleResourceFilterChange = (value) => {
    setResourceFilter(value);
  };
  return (
    <Stack direction="row">
      <ResourcesFilters
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

        <ResourcesFilterSearchBar
          resourceFilter={resourceFilter}
          handleResourceFilterChange={handleResourceFilterChange}
        />

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
