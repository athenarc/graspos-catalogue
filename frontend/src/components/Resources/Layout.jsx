import { useEffect, useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import ResourcesFilters, { ResourcesFilterSearchBar } from "./Filters";
import ResourcesGrid from "./Resources";
import { useLocation, useNavigate } from "react-router-dom";

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
        <Tab label="Documents" />
        <Tab label="Tools" />
      </Tabs>
    </Box>
  );
}

export default function ResourcesGridLayout({ user }) {
  const [resourceFilter, setResourceFilter] = useState("");
  const [selectedResource, setSelectedResource] = useState(0); // Default to datasets
  const [filters, setFilters] = useState({ licenses: {} });
  const location = useLocation();
  const navigate = useNavigate();

  const resourceMap = {
    datasets: 0,
    documents: 1,
    tools: 2,
  };

  // Extract filters and selected resource from the URL
  const extractFiltersFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = { licenses: {} };

    // Extract license filters from the URL
    searchParams.getAll("license").forEach((value) => {
      newFilters.licenses[value] = true;
    });

    // Extract the selected resource (tab) from the URL
    const tab = searchParams.get("tab");
    if (tab) {
      setSelectedResource(resourceMap[tab] || 0); // Default to datasets (0) if not found
    }

    setFilters(newFilters); // Update the filters state
  };

  useEffect(() => {
    extractFiltersFromURL();
  }, [location]);

  // Update the URL with new filters and selected tab
  const updateURLFilters = (newFilters, selectedTab) => {
    const searchParams = new URLSearchParams();

    // Serialize licenses and other filters
    Object.entries(newFilters).forEach(([filterType, filterValues]) => {
      if (filterType === "licenses") {
        Object.entries(filterValues).forEach(([license, selected]) => {
          if (selected) {
            searchParams.append("license", license);
          }
        });
      }
    });

    // Set the selected tab (resource) in the URL
    const resourceName = Object.keys(resourceMap).find(
      (key) => resourceMap[key] === selectedTab
    );
    if (resourceName) {
      searchParams.set("tab", resourceName);
    }

    // Update the URL with the new search parameters
    navigate(
      { pathname: location.pathname, search: `?${searchParams.toString()}` },
      { replace: true }
    );
  };

  const handleChangeFilters = (newFilters) => {
    setFilters(newFilters); // Update filters state
    updateURLFilters(newFilters, selectedResource); // Update URL filters
  };

  const handleSetSelectedResource = (event, newValue) => {
    // Reset filters when changing the tab (resource)
    setFilters({ licenses: {} });

    // Update the selectedResource state (tab change)
    setSelectedResource(newValue);

    // Reset URL search parameters (except for the tab)
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("license"); // Reset license filters

    const selectedResourceName = Object.keys(resourceMap).find(
      (key) => resourceMap[key] === newValue
    );
    if (selectedResourceName) {
      searchParams.set("tab", selectedResourceName); // Set the tab resource in the URL
    }

    // Update the URL without changing the tab parameter
    navigate(
      { pathname: location.pathname, search: `?${searchParams.toString()}` },
      { replace: true }
    );
  };

  const handleResourceFilterChange = (value) => {
    setResourceFilter(value); // Update resource filter value
  };

  const handleResetFilters = (resetTabs = true) => {
    // Reset tabs if resetTabs is true
    if (resetTabs) {
      setSelectedResource(0); // Set default tab to datasets
    }

    // Reset filters (e.g., license filters)
    setFilters({ licenses: {} });

    // Update the URL search parameters without affecting the tab
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("license"); // Reset license filters
    navigate(
      { pathname: location.pathname, search: `?${searchParams.toString()}` },
      { replace: true }
    );
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
