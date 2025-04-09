import { useEffect, useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesFilters, { ResourcesFilterBar } from "./Filters";
import ResourcesGrid from "./Resources";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error(err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

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
  const [selectedResource, setSelectedResource] = useLocalStorage("selectedResource", 0);
  const [filters, setFilters] = useState([]);

  function handleChangeFilters(filters) {
    setFilters(filters);
  }

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
  };

  function handleResourceFilterChange(value) {
    setResourceFilter(value);
  }
  return (
    <Stack direction="row">
      <ResourcesFilters
        selectedResource={selectedResource}
        filters={filters}
        handleChangeFilters={handleChangeFilters}
      />
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
