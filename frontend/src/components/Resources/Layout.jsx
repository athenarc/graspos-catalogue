import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Grid2 as Grid,
  Stack,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import { RectangularVariants } from "../Skeleton";
import ResourceGridItem from "./ResourceGridItem";
import { useTools } from "../../queries/tool";
import { useDocuments } from "../../queries/document";
import { useDatasets } from "../../queries/dataset";
import ResourcesFilters from "./Filters";
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
function ResourcesFilterBar({ resourceFilter, handleResourceFilterChange }) {
  return (
    <Stack sx={{ p: 2 }}>
      <Grid size={12} sx={{ margin: "auto", textAlign: "left" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          placeholder="Search Resource.."
          size="small"
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
        />
      </Grid>
    </Stack>
  );
}

function Datasets({ user, filter }) {
  const datasets = useDatasets();
  const [filteredDatasets, setFilteredDatasets] = useState(
    datasets?.data?.data ?? []
  );
  useEffect(() => {
    if (filter !== "") {
      setFilteredDatasets(
        datasets?.data?.data?.filter((dataset) =>
          dataset?.zenodo?.metadata?.title
            ?.toLowerCase()
            .includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredDatasets(datasets?.data?.data);
    }
  }, [datasets?.data?.data, filter]);

  return (
    <>
      {datasets?.isLoading && <RectangularVariants count={3} />}
      {datasets?.isSuccess &&
        filteredDatasets?.map((dataset) => (
          <ResourceGridItem
            key={dataset?._id}
            resource={dataset}
            type={"Dataset"}
            user={user}
          />
        ))}
      {user && (
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/dataset/add"
          sx={{
            position: "absolute",
            right: "24px",
            bottom: "24px",
            backgroundColor: "#fff",
          }}
        >
          Add Dataset
        </Button>
      )}
    </>
  );
}

function Documents({ user, filter }) {
  const documents = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState(
    documents?.data?.data ?? []
  );
  useEffect(() => {
    if (filter !== "") {
      setFilteredDocuments(
        documents?.data?.data?.filter((document) =>
          document?.zenodo?.metadata?.title
            ?.toLowerCase()
            .includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredDocuments(documents?.data?.data);
    }
  }, [documents?.data?.data, filter]);

  return (
    <>
      {documents?.isLoading && <RectangularVariants count={3} />}
      {documents?.isFetched &&
        filteredDocuments?.map((document) => (
          <ResourceGridItem
            key={document._id}
            resource={document}
            type={"Document"}
            user={user}
          />
        ))}
      {user && (
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/document/add"
          sx={{
            position: "absolute",
            right: "24px",
            bottom: "24px",
            backgroundColor: "#fff",
          }}
        >
          Add Document
        </Button>
      )}
    </>
  );
}

function Tools({ user, filter }) {
  const tools = useTools();
  const [filteredTools, setFilteredTools] = useState(tools?.data?.data ?? []);
  useEffect(() => {
    if (filter !== "") {
      setFilteredTools(
        tools?.data?.data?.filter((tool) =>
          tool?.zenodo?.metadata?.title
            ?.toLowerCase()
            .includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredTools(tools?.data?.data);
    }
  }, [tools?.data?.data, filter]);

  return (
    <>
      {tools?.isLoading && <RectangularVariants count={3} />}
      {tools?.isFetched &&
        filteredTools?.map((tool) => (
          <ResourceGridItem
            key={tool._id}
            resource={tool}
            type={"Tool"}
            user={user}
          />
        ))}
      {user && (
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/tool/add"
          sx={{
            position: "absolute",
            right: "24px",
            bottom: "24px",
            backgroundColor: "#fff",
          }}
        >
          Add Tool
        </Button>
      )}
    </>
  );
}

export default function ResourcesGridLayout({ user }) {
  const [resourceFilter, setResourceFilter] = useState("");
  const [selectedResource, setSelectedResource] = useState(0);

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
  };

  function handleResourceFilterChange(value) {
    setResourceFilter(value);
  }
  return (
    <Stack direction="row">
      <ResourcesFilters />
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
        />
      </Stack>
    </Stack>
  );
}
