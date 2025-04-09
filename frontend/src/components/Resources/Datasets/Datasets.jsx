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

export function Datasets({ user, filter }) {
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

export function Dataset({ resourceId }) {
  const dataset = useDataset(resourceId);
  return (
    <>
      <Grid size={8}>
        <ResourceBasicInformation resource={dataset} />
      </Grid>
      <Grid size={4}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={dataset} />
          <ResourceTags resource={dataset} />
          <ResourceLicense resource={dataset} />
        </Stack>
      </Grid>
    </>
  );
}
