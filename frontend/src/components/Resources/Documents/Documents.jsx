import { useDocument } from "../../../queries/document";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceTemplate/ResourceGridItem";
import { Grid2 as Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
  ResourceStatistics,
} from "../ResourceTemplate/ResourcePage";

export function Documents({ documents, user }) {
  const theme = useTheme();

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
        <Stack
          direction="column"
          spacing={3}
          sx={{
            position: "sticky",
            top: 24,
            width: "100%",
            margin: "0 auto",
          }}
        >
          <ResourceAuthors resource={document} />
          <ResourceTags resource={document} />
          <ResourceLicense resource={document} />
          <ResourceStatistics resource={document} />
        </Stack>
      </Grid>
    </>
  );
}
