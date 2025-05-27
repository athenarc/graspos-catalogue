import { useService } from "../../../queries/service";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceTemplate/ResourceGridItem";
import { Grid2 as Grid, Stack, useTheme } from "@mui/material";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
  ResourceStatistics,
  ResourceGeographicCoverage
} from "../ResourceTemplate/ResourcePage";

export function Services({ services, user }) {
  const theme = useTheme();

  return (
    <>
      {services?.isLoading && <RectangularVariants count={2} />}
      {services?.isFetched &&
        services?.data?.map((service) => (
          <ResourceGridItem
            key={service._id}
            resource={service}
            type={"Service"}
            user={user}
          />
        ))}
    </>
  );
}

export function Service({ resourceId }) {
  const service = useService(resourceId);
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={service} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={service} />
          <ResourceTags resource={service} />
          <ResourceLicense resource={service} />
          <ResourceStatistics resource={service} />
          <ResourceGeographicCoverage resource={service} />
        </Stack>
      </Grid>
    </>
  );
}
