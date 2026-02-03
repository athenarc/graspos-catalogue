import { useDatasetByUniqueSlug } from "@queries/dataset";
import ResourceGridItem from "../ResourcesGrid/ResourceGridItem";
import { Grid2 as Grid, Stack } from "@mui/material";
import {
  StatisticsCard,
  CoverageCard,
  SupportCard,
  AuthorsCard,
  GovernanceSustainabilityFundingCard,
  EquityEthicalCard,
} from "../ResourcesGrid/ResourcePageComponents/ResourcePageCards";
import { ResourceBasicInformation } from "../ResourcesGrid/ResourcePageComponents/ResourcePageBasicInformation";
import ResourceMessage from "@helpers/ResourceMessage";
import { RectangularVariants } from "@helpers/Skeleton";
import { useEffect } from "react";

export function Datasets({ datasets, user, isMobile }) {
  if (datasets?.isLoading) {
    return <RectangularVariants width="100%" height={300} count={4} />;
  }

  if (datasets?.isError) {
    return (
      <ResourceMessage
        message={
          datasets?.error?.response?.data?.detail ??
          "An error occurred while fetching datasets."
        }
        status="error"
      />
    );
  }

  if (datasets?.isSuccess && datasets?.data?.length === 0) {
    return <ResourceMessage message="No datasets found." status="info" />;
  }

  if (datasets?.isSuccess) {
    return datasets?.data?.map((dataset) => (
      <ResourceGridItem
        key={dataset?._id}
        resource={dataset}
        type={"Dataset"}
        user={user}
        isMobile={isMobile}
      />
    ));
  }
}

export function Dataset({ resourceUniqueSlug, handleSetResource }) {
  const dataset = useDatasetByUniqueSlug(resourceUniqueSlug);

  useEffect(() => {
    if (dataset?.isSuccess) {
      handleSetResource(dataset?.data?.data);
    }
  }, [dataset, handleSetResource]);

  const contributors =
    dataset?.data?.data?.zenodo?.metadata?.contributors ?? [];
  const authors = dataset?.data?.data?.zenodo?.metadata?.creators ?? [];

  if (dataset?.isError) {
    const errorMessage = dataset?.error?.status?.toString()?.startsWith("4")
      ? "Tool not found."
      : "An error occurred while fetching the dataset.";
    return <ResourceMessage message={errorMessage} status="error" />;
  }

  if (dataset?.isSuccess) {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ResourceBasicInformation resource={dataset} type="dataset" />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AuthorsCard
                resource={dataset}
                people={authors}
                label="Authors"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GovernanceSustainabilityFundingCard resource={dataset} />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AuthorsCard
                resource={dataset}
                people={contributors}
                label="Contributors"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <EquityEthicalCard resource={dataset} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ width: "100%", mt: { xs: 3, lg: 0 } }}>
            <StatisticsCard resource={dataset} />
            <CoverageCard resource={dataset} />
            <SupportCard resource={dataset} />
          </Stack>
        </Grid>
      </Grid>
    );
  }
}
