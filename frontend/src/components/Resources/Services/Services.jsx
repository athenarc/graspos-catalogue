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
import ResourceMessage from "@helpers/ResourceMessage";
import { useEffect } from "react";

export function Services({ services, user }) {
  if (services?.isLoading) {
    return <RectangularVariants width="100%" height={300} count={4} />;
  }

  if (services?.isError) {
    return (
      <ResourceMessage
        message={
          services?.error?.response?.data?.detail ??
          "An error occurred while fetching services."
        }
        status="error"
      />
    );
  }

  if (services?.isSuccess && services?.data?.length === 0) {
    return <ResourceMessage message="No services found." status="info" />;
  }

  if (services?.isSuccess) {
    return services?.data?.map((service) => (
      <ResourceGridItem
        key={services?._id}
        resource={service}
        type={"Service"}
        user={user}
      />
    ));
  }
}

export function Service({ resourceId, handleSetResource }) {
  const service = useService(resourceId);
  useEffect(() => {
    if (service?.isSuccess) {
      handleSetResource(service?.data?.data);
    }
  }, [service, handleSetResource]);
  const contributors =
    service?.data?.data?.openaire?.metadata?.resourceOrganisation ?? [];

  const authors = service?.data?.data?.openaire?.metadata?.creators ?? [];

  if (service?.isError) {
    const errorMessage = service?.error?.status?.toString()?.startsWith("4")
      ? "Service not found."
      : "An error occurred while fetching the service.";
    return <ResourceMessage message={errorMessage} status="error" />;
  }
  if (service?.isSuccess) {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ResourceBasicInformation resource={service} type={"service"} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AuthorsCard
                resource={service}
                people={authors}
                label="Authors"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GovernanceSustainabilityFundingCard resource={service} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AuthorsCard
                resource={service}
                people={
                  Array.isArray(contributors)
                    ? contributors
                    : [contributors].map((contributor) => ({
                        name: contributor,
                      }))
                }
                label="Contributors"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <EquityEthicalCard resource={service} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack
            direction="column"
            spacing={3}
            sx={{
              top: 24,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <CoverageCard resource={service} />
            <SupportCard resource={service} />
          </Stack>
        </Grid>
      </Grid>
    );
  }
}
