import { useDocument } from "../../../queries/document";
import { RectangularVariants } from "../../Helpers/Skeleton";
import ResourceGridItem from "../ResourcesGrid/ResourceGridItem";
import { Grid2 as Grid, Stack } from "@mui/material";
import {
  AuthorsCard,
  LicenseCard,
  TagsCard,
  StatisticsCard,
  GeographicCoverageCard,
} from "../ResourcesGrid/ResourcePageComponents/ResourcePageCards";

import { ResourceBasicInformation } from "../ResourcesGrid/ResourcePageComponents/ResourcePageBasicInformation";

export function Documents({ documents, user }) {
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
          <AuthorsCard resource={document} />
          <TagsCard resource={document} />
          <LicenseCard resource={document} />
          <StatisticsCard resource={document} />
          <GeographicCoverageCard resource={document} />
        </Stack>
      </Grid>
    </>
  );
}
