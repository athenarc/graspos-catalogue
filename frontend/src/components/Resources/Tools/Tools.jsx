import { useEffect, useState } from "react";
import { useTools, useTool } from "../../../queries/tool";
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

export function Tools({ user, filter, filters }) {
  const tools = useTools(filters);
  const [filteredTools, setFilteredTools] = useState([]);

  useEffect(() => {
    if (tools?.data) {
      const filteredData = filter
        ? tools?.data?.filter(
            (tool) =>
              tool?.zenodo?.metadata?.title
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
              tool?.zenodo?.metadata?.description
                ?.toLowerCase()
                .includes(filter.toLowerCase())
          )
        : tools?.data;

      setFilteredTools(filteredData);
    }
  }, [tools?.data, filter, filters]);

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

export function Tool({ resourceId }) {
  const tool = useTool(resourceId);
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={tool} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={tool} />
          <ResourceTags resource={tool} />
          <ResourceLicense resource={tool} />
        </Stack>
      </Grid>
    </>
  );
}
