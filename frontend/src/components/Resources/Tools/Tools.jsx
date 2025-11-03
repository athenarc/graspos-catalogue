import { useTool } from "@queries/tool";
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

export function Tools({ tools, user }) {
  if (tools?.isLoading) {
    return <RectangularVariants width="100%" height={300} count={4} />;
  }

  if (tools?.isError) {
    return (
      <ResourceMessage
        message={
          tools?.error?.response?.data?.detail ??
          "An error occurred while fetching tools."
        }
        status="error"
      />
    );
  }

  if (tools?.isSuccess && tools?.data?.length === 0) {
    return <ResourceMessage message="No tools found." status="info" />;
  }

  if (tools?.isSuccess) {
    return tools?.data?.map((tool) => (
      <ResourceGridItem
        key={tools?._id}
        resource={tool}
        type={"Tool"}
        user={user}
      />
    ));
  }
}

export function Tool({ resourceId, handleSetResource }) {
  const tool = useTool(resourceId);
  useEffect(() => {
    if (tool?.isSuccess) {
      handleSetResource(tool?.data?.data);
    }
  }, [tool, handleSetResource]);

  const contributors = tool?.data?.data?.zenodo?.metadata?.contributors ?? [];
  const authors = tool?.data?.data?.zenodo?.metadata?.creators ?? [];

  if (tool?.isError) {
    const errorMessage = tool?.error?.status?.toString()?.startsWith("4")
      ? "Tool not found."
      : "An error occurred while fetching the tool.";
    return <ResourceMessage message={errorMessage} status="error" />;
  }
  if (tool?.isSuccess) {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
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
          <Stack
            direction="column"
            spacing={3}
            sx={{
              top: 24,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <StatisticsCard resource={tool} />
            <CoverageCard resource={tool} />
            <SupportCard resource={tool} />
          </Stack>
        </Grid>
      </Grid>
    );
  }
}
