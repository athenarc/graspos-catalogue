import { useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
// import ResourcesFilters from "./Filters/FilterDrawer";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./FiltersLayout/Filters/Utils/useURLFilters";
import SearchBar from "./FiltersLayout/Filters/SearchBar";
import FiltersLayout from "./FiltersLayout/Layout";
import ResourcesFiltersDrawer from "./FiltersLayout/FilterDrawer";

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
  const [sortOrder, setSortOrder] = useState({
    field: "views",
    direction: "asc",
  });

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
      <FiltersLayout
        selectedResource={selectedResource}
        selectedFilters={filters}
        handleChangeFilters={handleChangeFilters}
        onResetFilters={handleResetFilters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <Stack direction="column" sx={{ width: "100%" }}>
        <ResourcesTabs
          selectedResource={selectedResource}
          handleSetSelectedResource={handleSetSelectedResource}
        />

        <SearchBar
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
