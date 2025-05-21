import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid2 as Grid,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { Dataset } from "../Datasets/Datasets";
import { Document } from "../Documents/Documents";
import { Tool } from "../Tools/Tools";
import orcidLogo from "../../../assets/orcid.logo.icon.svg";

export function ResourceBasicInformation({ resource }) {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5">
            <Link
              to={
                "https://zenodo.org/records/" +
                resource?.data?.data?.zenodo?.zenodo_id
              }
              target="_blank"
            >
              {resource?.data?.data?.zenodo?.title ?? "Title"}
            </Link>
          </Typography>
        }
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          overflowY: "auto",
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

export function ResourceAuthors({ resource }) {
  const authors = resource?.data?.data?.zenodo?.metadata?.creators || [];
  console.log(authors);
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">Authors</Typography>}
      ></CardHeader>
      <CardContent sx={{ textAlign: [resource.isLoading ? "center" : "left"] }}>
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column">
            {authors.map((author) => (
              <Stack direction="row" key={author?.name} alignItems="center">
                {author?.name + " " + author?.affiliation}
                {author?.orcid && (
                  <Link
                    to={"https://orcid.org/" + author?.orcid}
                    target="_blank"
                  >
                    <Avatar
                      sx={{ bgcolor: "#A6CE39", width: 20, height: 20, ml: 1 }}
                      alt="orcid"
                      src={orcidLogo}
                    />
                  </Link>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export function ResourceTags({ resource }) {
  const keywords = resource?.data?.data?.zenodo?.metadata?.keywords || [];
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">Tags</Typography>}
      ></CardHeader>
      <CardContent sx={{ textAlign: [resource.isLoading ? "center" : "left"] }}>
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column" justifyContent="center">
            {keywords?.length > 0 ? (
              <Grid2 container spacing={1}>
                {keywords?.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Grid2>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                No tags available
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export function ResourceLicense({ resource }) {
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

export function ResourcePage() {
  const { resourceId } = useParams();
  const location = useLocation();

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 112px)",
        overflowY: "auto",
        px: 2,
        py: 2,
      }}
    >
      <Grid container spacing={2} p={2} sx={{ minHeight: "100%" }}>
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
    </Box>
  );
}
