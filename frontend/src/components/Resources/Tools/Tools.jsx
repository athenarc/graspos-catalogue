import { useTool } from "../../../queries/tool";
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
  const contributors = tool?.data?.data?.zenodo?.metadata?.contributors ?? [];
  const authors = tool?.data?.data?.zenodo?.metadata?.creators ?? [];
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={tool} type={"tool"} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AuthorsCard resource={tool} people={authors} label="Authors" />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <GovernanceSustainabilityFundingCard resource={tool} />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AuthorsCard
              resource={tool}
              people={contributors}
              label="Contributors"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <EquityEthicalCard resource={tool} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <StatisticsCard resource={tool} />
          <CoverageCard resource={tool} />
          <SupportCard resource={tool} />
        </Stack>
      </Grid>
    </>
  );
}
