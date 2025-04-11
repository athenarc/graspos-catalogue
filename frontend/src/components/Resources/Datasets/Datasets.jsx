import { useEffect, useState } from "react";
import { useDataset, useDatasets } from "../../../queries/dataset";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceTemplate/ResourceGridItem";
import { Button, Grid2 as Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
} from "../ResourceTemplate/ResourcePage";

export function Datasets({ user, filter, filters }) {
  // Fetch datasets based on the filters
  const filterArray = Object.keys(filters || {}).flatMap((filterKey) => {
    const filterObj = filters[filterKey];

    // Ensure the filterObj is an object before applying filtering logic
    if (typeof filterObj === "object" && filterObj !== null) {
      return Object.keys(filterObj).filter((key) => filterObj[key]);
    }

    return [];
  });
  const datasets = useDatasets(filterArray);
  const [filteredDatasets, setFilteredDatasets] = useState([]);

  // Update filtered datasets whenever datasets, filter, or filters change
  useEffect(() => {
    if (datasets?.data) {
      // Apply the filter to datasets if filter is not empty
      const filteredData = filter
        ? datasets?.data?.filter(
            (dataset) =>
              dataset?.zenodo?.metadata?.title
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
              dataset?.zenodo?.metadata?.description
                ?.toLowerCase()
                .includes(filter.toLowerCase())
          )
        : datasets?.data; // If no filter, show all datasets

      // Update filtered datasets state
      setFilteredDatasets(filteredData);
    }
  }, [datasets?.data, filter, filters]);

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

export function Dataset({ resourceId }) {
  const dataset = useDataset(resourceId);
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={dataset} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={dataset} />
          <ResourceTags resource={dataset} />
          <ResourceLicense resource={dataset} />
        </Stack>
      </Grid>
    </>
  );
}
