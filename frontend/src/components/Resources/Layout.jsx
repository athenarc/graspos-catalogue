import { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "../Filters/Filters/Utils/useURLFilters";
import FiltersLayout from "../Filters/Layout";
import GlobalSearchBar from "../Filters/Filters/GlobalSearchBar";
import { useDatasets } from "../../queries/dataset";
import { useTools } from "../../queries/tool";
import { useDocuments } from "../../queries/document";
import LocalFiltersStack from "../Filters/LocalFiltersStack";
import { useServices } from "../../queries/service";

function ResourcesTabs({
  selectedResource,
  handleSetSelectedResource,
  filters,
  handleChangeFilters,
  resourcesFetched,
  loadingStatus,
}) {
  const renderLabel = (name) => {
    const displayName = name === "Documents" ? "Templates & Guidelines" : name;
    if (loadingStatus[name]) {
      return (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {displayName} <CircularProgress size={14} />
        </span>
      );
    }

    return `${displayName} (${resourcesFetched?.[name]?.results ?? 0})`;
  };

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
          <Tab label={renderLabel("Datasets")} />
          <Tab label={renderLabel("Tools")} />
          <Tab label={renderLabel("Documents")} />
          <Tab label={renderLabel("Services")} />
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

  const datasets = useDatasets(
    initialFetchDone
      ? shouldFetchAll || selectedResource === 0
        ? { ...globalFilters, ...(selectedResource === 0 ? localFilters : {}) }
        : null
      : { ...globalFilters }
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

  const [resourcesFetched, setResourcesFetched] = useState({
    Datasets: { results: 0 },
    Tools: { results: 0 },
    Documents: { results: 0 },
    Services: { results: 0 },
  });

  useEffect(() => {
    setResourcesFetched((prev) => {
      const newFetched = {
        ...prev,
        Datasets: datasets?.data
          ? { results: datasets.data.length }
          : prev.Datasets,
        Tools: tools?.data ? { results: tools.data.length } : prev.Tools,
        Documents: documents?.data
          ? { results: documents.data.length }
          : prev.Documents,
        Services: services?.data
          ? { results: services.data.length }
          : prev.Services,
      };

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
  }, [datasets.data, tools.data, documents.data, services.data]);

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
          loadingStatus={{
            Datasets: datasets.isLoading,
            Tools: tools.isLoading,
            Documents: documents.isLoading,
            Services: services.isLoading,
          }}
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
