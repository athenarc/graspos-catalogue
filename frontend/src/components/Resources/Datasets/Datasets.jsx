import { useDataset } from "../../../queries/dataset";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourcesGrid/ResourceGridItem";
import { Grid2 as Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  AuthorsCard,
  LicenseCard,
  TagsCard,
  StatisticsCard,
  GeographicCoverageCard,
  ContactInformationCard,
  ApiUrlInstructionsCard,
  DocumentationUrlCard,
} from "../ResourcesGrid/ResourcePageComponents/ResourcePageCards";
import { ResourceBasicInformation } from "../ResourcesGrid/ResourcePageComponents/ResourcePageBasicInformation";

export function Datasets({ datasets, user }) {
  const theme = useTheme();

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
          <AuthorsCard resource={dataset} />
          <LicenseCard resource={dataset} />
          <TagsCard resource={dataset} />
          <StatisticsCard resource={dataset} />
          <GeographicCoverageCard resource={dataset} />
          <ContactInformationCard resource={dataset} />
          <ApiUrlInstructionsCard resource={dataset} />
          <DocumentationUrlCard resource={dataset} />
        </Stack>
      </Grid>
    </>
  );
}
