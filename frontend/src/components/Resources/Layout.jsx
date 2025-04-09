import { useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesFilters, { ResourcesFilterBar } from "./Filters";
import ResourcesGrid from "./Resources";

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
        aria-label="basic tabs example"
        centered
      >
        <Tab label="Datasets" />
        <Tab label="Documents" />
        <Tab label="Tools" />
      </Tabs>
    </Box>
  );
}

export default function ResourcesGridLayout({ user }) {
  const [resourceFilter, setResourceFilter] = useState("");
  const [selectedResource, setSelectedResource] = useState(0);
  const [filters, setFilters] = useState([]);

  function handleChangeFilters(filters){
    setFilters(filters)
  }
 
  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
  };

  function handleResourceFilterChange(value) {
    setResourceFilter(value);
  }
  return (
    <Stack direction="row">
      <ResourcesFilters selectedResource={selectedResource} filters={filters} handleChangeFilters={handleChangeFilters}/>
      <Stack direction="column" sx={{ width: "100%" }}>
        <ResourcesTabs
          selectedResource={selectedResource}
          handleSetSelectedResource={handleSetSelectedResource}
        />
        <ResourcesFilterBar
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
