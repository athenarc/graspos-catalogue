import { useDocuments, useDocument } from "../../../queries/document";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceTemplate/ResourceGridItem";
import {
  Button,
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

export function Documents({ documents, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {documents?.isLoading && <RectangularVariants count={2} />}
      {documents?.isFetched &&
        documents?.data?.map((document) => (
          <ResourceGridItem
            key={document._id}
            resource={document}
            type={"Document"}
            user={user}
          />
        ))}

      {user && isMobile && (
        <Fab
          color="primary"
          component={Link}
          to="/document/add"
          title="Add Document"
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

      {user && !isMobile && (
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/document/add"
          sx={{
            position: "absolute",
            right: 24,
            bottom: 24,
            backgroundColor: "#fff",
          }}
        >
          Add Document
        </Button>
      )}
    </>
  );
}

export function Document({ resourceId }) {
  const document = useDocument(resourceId);
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={document} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={document} />
          <ResourceTags resource={document} />
          <ResourceLicense resource={document} />
        </Stack>
      </Grid>
    </>
  );
}
