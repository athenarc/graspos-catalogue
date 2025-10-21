import { useDataset } from "../../../queries/dataset";
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

export function Datasets({ datasets, user }) {
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
    </>
  );
}

export function Dataset({ resourceId }) {
  const dataset = useDataset(resourceId);
  return (
    <>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={dataset} type={"dataset"} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AuthorsCard resource={dataset} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <GovernanceSustainabilityFundingCard resource={dataset} />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ContributorsCard resource={dataset} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <EquityEthicalCard resource={dataset} />
          </Grid>
        </Grid>
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
          <StatisticsCard resource={dataset} />
          <CoverageCard resource={dataset} />
          <SupportCard resource={dataset} />
        </Stack>
      </Grid>
    </>
  );
}
