import { useEffect, useState } from "react";
import { useTools, useTool } from "../../../queries/tool";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceGridItem";
import { Button, Grid2 as Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
} from "../ResourceDetails";

export default function Tools({ user, filter }) {
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

export function Tool({ resourceId }) {
  const tool = useTool(resourceId);
  return (
    <>
      <Grid size={8}>
        <ResourceBasicInformation resource={tool} />
      </Grid>
      <Grid size={4}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={tool} />
          <ResourceTags resource={tool} />
          <ResourceLicense resource={tool} />
        </Stack>
      </Grid>
    </>
  );
}
