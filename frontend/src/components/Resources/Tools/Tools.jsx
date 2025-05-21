import { useTool } from "../../../queries/tool";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceTemplate/ResourceGridItem";
import {
  Fab,
  Grid2 as Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
  ResourceStatistics,
} from "../ResourceTemplate/ResourcePage";
import AddIcon from "@mui/icons-material/Add";

export function Tools({ tools, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {tools?.isLoading && <RectangularVariants count={2} />}
      {tools?.isFetched &&
        tools?.data?.map((tool) => (
          <ResourceGridItem
            key={tool._id}
            resource={tool}
            type={"Tool"}
            user={user}
          />
        ))}

      {user && isMobile && (
        <Fab
          color="primary"
          component={Link}
          to="/tool/add"
          title="Add Tool"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 40,
            height: 40,
            zIndex: theme.zIndex.drawer + 2,
          }}
        >
          <AddIcon />
        </Fab>
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
          <ResourceStatistics resource={tool} />
        </Stack>
      </Grid>
    </>
  );
}
