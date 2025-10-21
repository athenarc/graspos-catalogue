import { useService } from "../../../queries/service";
import { RectangularVariants } from "../../Helpers/Skeleton";
import ResourceGridItem from "../ResourcesGrid/ResourceGridItem";
import { Grid2 as Grid, Stack } from "@mui/material";
import {
  StatisticsCard,
  CoverageCard,
  SupportCard,
  AuthorsCard,
  ContributorsCard,
  GovernanceSustainabilityFundingCard,
  EquityEthicalCard,
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AuthorsCard resource={service} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <GovernanceSustainabilityFundingCard resource={service} />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ContributorsCard resource={service} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <EquityEthicalCard resource={service} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <StatisticsCard resource={service} />
          <CoverageCard resource={service} />
          <SupportCard resource={service} />
        </Stack>
      </Grid>
    </>
  );
}
