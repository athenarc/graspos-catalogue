import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import {
  Grid2 as Grid,
  Stack,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  touchRippleClasses,
} from "@mui/material";

import { RectangularVariants } from "./Skeleton";
import ResourceGridItem from "./ResourceGridItem";
import { useTools } from "../queries/tool";
import { useDocuments } from "../queries/document";
import { useDatasets } from "../queries/dataset";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
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
  const datasets = useDatasets(user);
  const [filteredDatasets, setFilteredDatasets] = useState(
    datasets?.data?.data ?? []
  );
  useEffect(() => {
    if (filter !== "") {
      setFilteredDatasets(
        datasets?.data?.data?.filter((dataset) =>
          dataset?.zenodo_metadata?.title
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
      {datasets?.isLoading && <RectangularVariants count={4} />}
      {datasets?.isSuccess &&
        filteredDatasets?.map((dataset) => (
          <ResourceGridItem
            key={dataset?._id}
            resource={dataset}
            type={"Dataset"}
            user={user}
          />
        ))}
    </>
  );
}

function Documents({ user, filter }) {
  const documents = useDocuments(user);
  const [filteredDocuments, setFilteredDocuments] = useState(
    documents?.data?.data ?? []
  );
  useEffect(() => {
    if (filter !== "") {
      setFilteredDocuments(
        documents?.data?.data?.filter((document) =>
          document?.zenodo_metadata?.title
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
      {documents?.isLoading && <RectangularVariants count={4} />}
      {documents?.isFetched &&
        filteredDocuments?.map((document) => (
          <ResourceGridItem
            key={document._id}
            resource={document}
            type={"Document"}
            user={user}
          />
        ))}
    </>
  );
}

function Tools({ user, filter }) {
  const tools = useTools(user);
  const [filteredTools, setFilteredTools] = useState(tools?.data?.data ?? []);
  useEffect(() => {
    if (filter !== "") {
      setFilteredTools(
        tools?.data?.data?.filter((tool) =>
          tool?.zenodo_metadata?.title
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
      {tools?.isLoading && <RectangularVariants count={4} />}
      {tools?.isFetched &&
        filteredTools?.map((tool) => (
          <ResourceGridItem
            key={tool._id}
            resource={tool}
            type={"Tool"}
            user={user}
          />
        ))}
    </>
  );
}

export default function ResourcesGrid({ user }) {
  const [resourceFilter, setResourceFilter] = useState("");
  const [selectedResource, setSelectedResource] = useState(0);

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
  };

  function handleResourceFilterChange(value) {
    setResourceFilter(value);
  }
  return (
    <>
      <ResourcesTabs
        selectedResource={selectedResource}
        handleSetSelectedResource={handleSetSelectedResource}
      />
      <ResourcesFilterBar
        resourceFilter={resourceFilter}
        handleResourceFilterChange={handleResourceFilterChange}
      />

      <Grid
        container
        spacing={3}
        m={3}
        mt={1}
        alignItems="start"
        sx={{ maxHeight: "75vh", overflow: "auto" }}
      >
        {selectedResource == 0 && (
          <Datasets user={user} filter={resourceFilter} />
        )}

        {selectedResource == 1 && (
          <Documents user={user} filter={resourceFilter} />
        )}

        {selectedResource == 2 && <Tools user={user} filter={resourceFilter} />}
      </Grid>
      {user && selectedResource == 0 && (
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
          Add Resource
        </Button>
      )}
      {user && selectedResource == 1 && (
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
          Add Resource
        </Button>
      )}
      {user && selectedResource == 2 && (
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
          Add Resource
        </Button>
      )}
      <Outlet
        context={{
          user: user,
        }}
      />
    </>
  );
}
