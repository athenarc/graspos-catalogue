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
  const datasets = useDatasets(filters);
  const [filteredDatasets, setFilteredDatasets] = useState([]);

  useEffect(() => {
    if (datasets?.data) {
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
        : datasets?.data;

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
