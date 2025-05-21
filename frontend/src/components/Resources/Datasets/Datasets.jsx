import { useDataset } from "../../../queries/dataset";
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
} from "../ResourceTemplate/ResourcePage";
import AddIcon from "@mui/icons-material/Add";

export function Datasets({ datasets, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {datasets?.isLoading && <RectangularVariants count={2} />}
      {datasets?.isSuccess &&
        datasets?.data?.map((dataset) => (
          <ResourceGridItem
            key={dataset?._id}
            resource={dataset}
            type={"Dataset"}
            user={user}
          />
        ))}
      {user && isMobile && (
        <Fab
          color="primary"
          component={Link}
          to="/dataset/add"
          title="Add Dataset"
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
