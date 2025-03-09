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
} from "@mui/material";

import { useDatasets, useDocuments } from "../queries/data";

import { RectangularVariants } from "./Skeleton";
import ResourceGridItem from "./ResourceGridItem";

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
        <Tab label="Datasets" {...a11yProps(0)} />
        <Tab label="Documents" {...a11yProps(1)} />
        <Tab label="Tools" {...a11yProps(2)} />
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

export default function ResourcesGrid({ user }) {
  const datasets = useDatasets();
  const documents = useDocuments();
  const [resourceFilter, setResourceFilter] = useState("");
  const [selectedResource, setSelectedResource] = useState(0);

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
  };
  const [filteredResources, setFilteredResources] = useState(
    documents?.data?.data ?? []
  );
  const [filteredDatasets, setFilteredDatasets] = useState(
    datasets?.data?.data ?? []
  );

  useEffect(() => {
    setFilteredResources(documents?.data?.data);
    setFilteredDatasets(datasets?.data?.data);
  }, [datasets?.data?.data, documents?.data?.data]);

  function handleResourceFilterChange(value) {
    setResourceFilter(value);
    if (value === "") {
      setFilteredResources(documents?.data?.data);
      setFilteredDatasets(datasets?.data?.data);
    } else {
      setFilteredResources(
        documents?.data?.data?.filter((resource) =>
          resource.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredDatasets(
        datasets?.data?.data?.filter((dataset) =>
          dataset.title.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
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
        {datasets.isLoading && <RectangularVariants count={4} />}
        {documents.isLoading && <RectangularVariants count={4} />}

        {selectedResource == 0 &&
          filteredDatasets?.map((dataset) => (
            <ResourceGridItem
              key={dataset._id}
              resource={dataset}
              type={"Dataset"}
              user={user}
            />
          ))}
        {selectedResource == 1 &&
          filteredResources?.map((resource) => (
            <ResourceGridItem
              key={resource._id}
              resource={resource}
              type={"Document"}
              user={user}
            />
          ))}
      </Grid>
      {user && (
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/resources/add"
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
      <Outlet context={{ user: user }} />
    </>
  );
}
