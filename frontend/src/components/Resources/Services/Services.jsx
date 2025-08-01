import { useService } from "../../../queries/service";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourcesGrid/ResourceGridItem";
import { Grid2 as Grid, Stack } from "@mui/material";
import {
  ContributorsCard,
  TrlCard,
  TagsCard,
  StatisticsCard,
  GeographicCoverageCard,
} from "../ResourcesGrid/ResourcePageComponents/ResourcePageCards";
import { ResourceBasicInformation } from "../ResourcesGrid/ResourcePageComponents/ResourcePageBasicInformation";

export function Services({ services, user }) {
  return (
    <>
      {services?.isLoading && <RectangularVariants count={2} />}
      {services?.isFetched &&
        services?.data?.map((service) => (
          <ResourceGridItem
            key={service._id}
            resource={service}
            type={"service"}
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
        <ResourceBasicInformation resource={service} type={"service"} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <ContributorsCard resource={service} type={"service"} />
          <TagsCard resource={service} />
          <TrlCard resource={service} />
          <StatisticsCard resource={service} />
          <GeographicCoverageCard resource={service} />
        </Stack>
      </Grid>
    </>
  );
}
