import { useEffect, useRef, useState } from "react";
import { Box, Stack, Tabs, Tab, useTheme, useMediaQuery } from "@mui/material";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./FiltersLayout/Filters/Utils/useURLFilters";
import FiltersLayout from "./FiltersLayout/Layout";
import GlobalSearchBar from "./FiltersLayout/Filters/GlobalSearchBar";
import { useDatasets } from "../../queries/dataset";
import { useTools } from "../../queries/tool";
import { useDocuments } from "../../queries/document";
import LocalFiltersStack from "./FiltersLayout/LocalFiltersStack";
import { useServices } from "../../queries/service";

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
              typeof resourcesFetched?.Datasets?.results === "number"
                ? `Datasets (${resourcesFetched?.Datasets?.results})`
                : "Datasets"
            }
          />
          <Tab
            label={
              typeof resourcesFetched?.Tools?.results === "number"
                ? `Tools (${resourcesFetched?.Tools?.results})`
                : "Tools"
            }
          />
          <Tab
            label={
              typeof resourcesFetched?.Documents?.results === "number"
                ? `Templates & Guidelines (${resourcesFetched?.Documents?.results})`
                : "Templates & Guidelines"
            }
          />
          <Tab
            label={
              typeof resourcesFetched?.Services?.results === "number"
                ? `Services (${resourcesFetched?.Services?.results})`
                : "Services"
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
    Services: 3,
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    if (!initialFetchDone) {
      setInitialFetchDone(true);
    }
  }, []);

  // Updated useURLFilters to expose globalFilters, localFilters and shouldFetchAll
  const {
    filters,
    globalFilters,
    localFilters,
    shouldFetchAll,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  } = useURLFilters(resourceMap);
  console.log(shouldFetchAll);
  // Fetch resources with combined filters only if shouldFetchAll or matching selectedResource
  const datasets = useDatasets(
    initialFetchDone
      ? shouldFetchAll || selectedResource === 0
        ? { ...globalFilters, ...(selectedResource === 0 ? localFilters : {}) }
        : null
      : { ...globalFilters } // initial global fetch without localFilters
  );

  const tools = useTools(
    initialFetchDone
      ? shouldFetchAll || selectedResource === 1
        ? { ...globalFilters, ...(selectedResource === 1 ? localFilters : {}) }
        : null
      : { ...globalFilters }
  );

  const documents = useDocuments(
    initialFetchDone
      ? shouldFetchAll || selectedResource === 2
        ? { ...globalFilters, ...(selectedResource === 2 ? localFilters : {}) }
        : null
      : { ...globalFilters }
  );

  const services = useServices(
    initialFetchDone
      ? shouldFetchAll || selectedResource === 3
        ? { ...globalFilters, ...(selectedResource === 3 ? localFilters : {}) }
        : null
      : { ...globalFilters }
  );

  // Track resource counts for tabs labels
  const [resourcesFetched, setResourcesFetched] = useState({
    Datasets: { results: 0 },
    Tools: { results: 0 },
    Documents: { results: 0 },
    Services: { results: 0 },
  });

  const prevGlobalFiltersRef = useRef(globalFilters);
  const prevSelectedResourceRef = useRef(selectedResource);
  const isInitialLoad = useRef(true);
  useEffect(() => {
    setResourcesFetched((prev) => {
      const newFetched = { ...prev };

      // Update counts only for those with data loaded
      if (
        datasets?.data &&
        (shouldFetchAll || selectedResource === resourceMap.Datasets)
      ) {
        newFetched.Datasets.results = datasets.data.length;
      }
      if (
        tools?.data &&
        (shouldFetchAll || selectedResource === resourceMap.Tools)
      ) {
        newFetched.Tools.results = tools.data.length;
      }
      if (
        documents?.data &&
        (shouldFetchAll || selectedResource === resourceMap.Documents)
      ) {
        newFetched.Documents.results = documents.data.length;
      }
      if (
        services?.data &&
        (shouldFetchAll || selectedResource === resourceMap.Services)
      ) {
        newFetched.Services.results = services.data.length;
      }

      // Only update state if counts changed
      if (
        prev.Datasets.results === newFetched.Datasets.results &&
        prev.Tools.results === newFetched.Tools.results &&
        prev.Documents.results === newFetched.Documents.results &&
        prev.Services.results === newFetched.Services.results
      ) {
        return prev;
      }

      return newFetched;
    });
  }, [
    datasets?.data,
    tools?.data,
    documents?.data,
    services?.data,
    selectedResource,
    shouldFetchAll,
  ]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Box
        sx={{
          width: { xs: 0, md: 350 },
          flexShrink: 0,
        }}
      >
        <FiltersLayout
          selectedResource={selectedResource}
          selectedFilters={filters}
          handleChangeFilters={handleChangeFilters}
          onResetFilters={handleResetFilters}
          isMobile={isMobile}
          theme={theme}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ResourcesTabs
          selectedResource={selectedResource}
          handleSetSelectedResource={handleSetSelectedResource}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
          resourcesFetched={resourcesFetched}
        />

        <LocalFiltersStack
          user={user}
          selectedResource={selectedResource}
          filters={filters}
          handleChangeFilters={handleChangeFilters}
          isMobile={isMobile}
        />

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, pb: 12, pt: 1 }}>
          <ResourcesGrid
            user={user}
            selectedResource={selectedResource}
            datasets={datasets}
            documents={documents}
            tools={tools}
            services={services}
          />
        </Box>
      </Box>
    </Box>
  );
}
