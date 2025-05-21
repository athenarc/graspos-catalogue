import { useEffect, useState } from "react";
import { Box, Stack, Tabs, Tab, useTheme, useMediaQuery } from "@mui/material";
import ResourcesGrid from "./Resources";
import { useURLFilters } from "./FiltersLayout/Filters/Utils/useURLFilters";
import FiltersLayout from "./FiltersLayout/Layout";
import GlobalSearchBar from "./FiltersLayout/Filters/GlobalSearchBar";
import { useDatasets } from "../../queries/dataset";
import { useTools } from "../../queries/tool";
import { useDocuments } from "../../queries/document";
import LocalFiltersStack from "./FiltersLayout/LocalFiltersStack";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
          selectedFilters={filters}
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
            resourceFilter={resourceFilter}
            filters={filters}
            setResourcesFetched={setResourcesFetched}
            datasets={datasets}
            documents={documents}
            tools={tools}
          />
        </Box>
      </Box>
    </Box>
  );
}
