import { useDocument } from "../../../queries/document";
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AuthorsCard resource={document} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <GovernanceSustainabilityFundingCard resource={document} />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ContributorsCard resource={document} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <EquityEthicalCard resource={document} />
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
          <StatisticsCard resource={document} />
          <CoverageCard resource={document} />
          <SupportCard resource={document} />
        </Stack>
      </Grid>
    </>
  );
}
