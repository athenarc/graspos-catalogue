import { useDocumentByUniqueSlug } from "@queries/document";
import { RectangularVariants } from "@helpers/Skeleton";
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
import { useEffect } from "react";

export function Documents({ documents, user, isMobile }) {
  if (documents?.isLoading) {
    return <RectangularVariants width="100%" height={300} count={4} />;
  }

  if (documents?.isError) {
    return (
      <ResourceMessage
        message={
          documents?.error?.response?.data?.detail ??
          "An error occurred while fetching templates/guidelines."
        }
        status="error"
      />
    );
  }

  if (documents?.isSuccess && documents?.data?.length === 0) {
    return (
      <ResourceMessage message="No templates/guidelines found." status="info" />
    );
  }

  if (documents?.isSuccess) {
    return documents?.data?.map((document) => (
      <ResourceGridItem
        key={document?._id}
        resource={document}
        type={"Document"}
        user={user}
        isMobile={isMobile}
      />
    ));
  }
}
export function Document({ resourceUniqueSlug, handleSetResource }) {
  const document = useDocumentByUniqueSlug(resourceUniqueSlug);

  useEffect(() => {
    if (document?.isSuccess) {
      handleSetResource(document?.data?.data);
    }
  }, [document, handleSetResource]);

  const contributors =
    document?.data?.data?.zenodo?.metadata?.contributors ?? [];
  const authors = document?.data?.data?.zenodo?.metadata?.creators ?? [];

  if (document?.isError) {
    const errorMessage = document?.error?.status?.toString()?.startsWith("4")
      ? "Template/guideline not found."
      : "An error occurred while fetching the template/guideline.";
    return <ResourceMessage message={errorMessage} status="error" />;
  }
  if (document?.isSuccess) {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ResourceBasicInformation resource={document} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AuthorsCard
                resource={document}
                people={authors}
                label="Authors"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <GovernanceSustainabilityFundingCard resource={document} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AuthorsCard
                resource={document}
                people={contributors}
                label="Contributors"
              />
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
      </Grid>
    );
  }
}
