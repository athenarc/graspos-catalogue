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
  // Fetch tools based on the filters
  
  const filterArray = Object.keys(filters).filter((key) => filters[key]);
  const tools = useTools(filterArray);
  const [filteredTools, setFilteredTools] = useState([]);

  // Update filtered tools whenever tools, filter, or filters change
  useEffect(() => {
    if (tools?.data) {
      // Apply the filter to tools if filter is not empty
      const filteredData = filter
        ? tools?.data?.filter((tool) =>
            tool?.zenodo?.metadata?.title
              ?.toLowerCase()
              .includes(filter.toLowerCase())
          )
        : tools?.data; // If no filter, show all tools

      // Update filtered tools state
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
