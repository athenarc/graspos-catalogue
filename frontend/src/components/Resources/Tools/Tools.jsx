import { useTool } from "../../../queries/tool";
import { RectangularVariants } from "../../Skeleton";
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

export function Tools({ tools, user }) {
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
    </>
  );
}

export function Tool({ resourceId }) {
  const tool = useTool(resourceId);
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={tool} type={"tool"} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <AuthorsCard resource={tool} />
          <TagsCard resource={tool} />
          <LicenseCard resource={tool} />
          <StatisticsCard resource={tool} />
          <GeographicCoverageCard resource={tool} />
        </Stack>
      </Grid>
    </>
  );
}
