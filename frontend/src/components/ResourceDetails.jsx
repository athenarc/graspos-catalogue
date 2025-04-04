import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDataset } from "../queries/dataset";
import { useDocument } from "../queries/document";
import { useTool } from "../queries/tool";

function ResourceBasicInformation({ resource }) {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5">
            {resource?.data?.data?.zenodo?.title ?? "Title"}
          </Typography>
        }
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column">
            {resource?.data?.data?.zenodo?.metadata?.description}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function ResourceAuthors({ resource }) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">Authors</Typography>}
      ></CardHeader>
      <CardContent sx={{ textAlign: [resource.isLoading ? "center" : "left"] }}>
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column">
            {resource?.data?.data?.zenodo?.metadata?.creators?.map((author) => (
              <Stack direction="row" key={author?.name}>
                {author?.name + " " + author?.affiliation}
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function ResourceTags({ resource }) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">Tags</Typography>}
      ></CardHeader>
      <CardContent sx={{ textAlign: [resource.isLoading ? "center" : "left"] }}>
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column">
            {resource?.data?.data?.zenodo?.metadata?.keywords?.map((tag) => (
              <Stack direction="row" key={tag}>
                {tag}
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function ResourceLicense({ resource }) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">License</Typography>}
      ></CardHeader>
      <CardContent sx={{ textAlign: [resource.isLoading ? "center" : "left"] }}>
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Typography>
            {resource?.data?.data?.zenodo?.metadata?.license?.id}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function Dataset({ resourceId }) {
  const dataset = useDataset(resourceId);
  return (
    <>
      <Grid size={8}>
        <ResourceBasicInformation resource={dataset} />
      </Grid>
      <Grid size={4}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={dataset} />
          <ResourceTags resource={dataset} />
          <ResourceLicense resource={dataset} />
        </Stack>
      </Grid>
    </>
  );
}

function Document({ resourceId }) {
  const document = useDocument(resourceId);
  return (
    <>
      <Grid size={8}>
        <ResourceBasicInformation resource={document} />
      </Grid>
      <Grid size={4}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={document} />
          <ResourceTags resource={document} />
          <ResourceLicense resource={document} />
        </Stack>
      </Grid>
    </>
  );
}

function Tool({ resourceId }) {
  const tool = useTool(resourceId);
  return (
    <>
      <Grid size={8}>
        <ResourceBasicInformation resource={tool} />
      </Grid>
      <Grid size={4}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={tool} />
          <ResourceTags resource={tool} />
          <ResourceLicense resource={tool} />
        </Stack>
      </Grid>
    </>
  );
}

export default function ResourceDetails({ type }) {
  const { resourceId } = useParams();
  const location = useLocation();
  return (
    <>
      <Grid container spacing={2} p={2}>
        {location.pathname.includes("dataset") && (
          <Dataset resourceId={resourceId} />
        )}
        {location.pathname.includes("documents") && (
          <Document resourceId={resourceId} />
        )}
        {location.pathname.includes("tools") && (
          <Tool resourceId={resourceId} />
        )}
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to={-1}
          sx={{
            position: "absolute",
            right: "24px",
            bottom: "24px",
            backgroundColor: "#fff",
          }}
        >
          Back
        </Button>
      </Grid>
    </>
  );
}
