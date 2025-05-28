import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid2 as Grid,
  Stack,
  Typography,
  Tooltip,
  Divider,
  Card,
  CardHeader,
  CardContent,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { Dataset } from "../Datasets/Datasets";
import { Document } from "../Documents/Documents";
import { Tool } from "../Tools/Tools";
import { Service } from "../Services/Services";
import orcidLogo from "../../../assets/orcid.logo.icon.svg";
import { ResourceItemScopes } from "./ResourceGridItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DOMPurify from "dompurify";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { useState } from "react";
import { sanitizeHtml, formatDate } from "../../utils";

const cardStyles = {
  lineHeight: 1.5,
  flexDirection: "column",
  display: "flex",
  justifyContent: "space-between",
  borderRadius: "5px",
  border: "1px solid #e0dfdf",
  backgroundColor: "#f8faff",
  boxShadow: 0,
  color: "#555",
};

export function ResourceBasicInformation({ resource }) {
  return (
    <Stack spacing={3}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h5" component="div">
          <Link
            to={
              "https://zenodo.org/records/" +
              resource?.data?.data?.zenodo?.zenodo_id
            }
            target="_blank"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
            }}
          >
            <Typography
              component="span"
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "rgb(174, 83, 142)",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {resource?.data?.data?.zenodo?.title ?? "Title"}
            </Typography>
            <LaunchIcon
              sx={{
                fontSize: "0.8em",
                color: "rgb(174, 83, 142)",
              }}
            />
          </Link>
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Publication date">
              <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {formatDate(
                resource?.data?.data?.zenodo?.metadata?.publication_date
              )}
            </Typography>
          </Stack>
          {resource?.data?.data?.zenodo?.metadata?.version && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Version">
                <HistoryIcon sx={{ fontSize: "1.1rem" }} />
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                Version {resource?.data?.data?.zenodo?.metadata?.version}
              </Typography>
            </Stack>
          )}
          <ResourceItemScopes resource={resource?.data?.data} />
        </Stack>
      </Stack>

      {resource.isLoading && <CircularProgress size="3rem" />}
      {resource && (
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            fontFamily: "inherit",
          }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(
              resource?.data?.data?.zenodo?.metadata?.description
            ),
          }}
        />
      )}
    </Stack>
  );
}

export function ResourceAuthors({ resource }) {
  const authors = resource?.data?.data?.zenodo?.metadata?.creators || [];
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Authors</Typography>}
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column" spacing={1}>
            {authors.map((author) => (
              <Stack direction="column" key={author?.name} spacing={0.5}>
                <Stack direction="row" alignItems="center">
                  {author?.orcid ? (
                    <Link
                      to={"https://orcid.org/" + author?.orcid}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      <Stack direction="row" alignItems="center">
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            color: "text.primary",
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {author?.name}
                        </Typography>
                        <Avatar
                          sx={{
                            bgcolor: "#A6CE39",
                            width: 20,
                            height: 20,
                            ml: 1,
                          }}
                          alt="orcid"
                          src={orcidLogo}
                        />
                      </Stack>
                    </Link>
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {author?.name}
                    </Typography>
                  )}
                </Stack>
                {author?.affiliation && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                    }}
                  >
                    {author.affiliation}
                  </Typography>
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
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Tags</Typography>}
      />
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column" justifyContent="center">
            {keywords?.length > 0 ? (
              <Grid container spacing={1}>
                {keywords?.map((keyword) => (
                  <Grid key={keyword}>
                    <Chip
                      label={keyword}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
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
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">License</Typography>}
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource?.data?.data?.zenodo?.metadata?.license?.id ? (
          <Typography>
            {resource?.data?.data?.zenodo?.metadata?.license?.id}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No tags available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function ResourceStatistics({ resource }) {
  const [detailsToggle, setDetailsToggle] = useState(false);
  function handleDetailsToggle() {
    setDetailsToggle(!detailsToggle);
  }
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Usage Statistics</Typography>}
      />
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ width: "100%" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "50%", py: 2 }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h4"
                    fontWeight="500"
                    color="primary.main"
                  >
                    {resource?.data?.data?.zenodo?.stats?.unique_views ?? "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon
                      sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      views
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "50%", py: 2 }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h4"
                    fontWeight="500"
                    color="primary.main"
                  >
                    {resource?.data?.data?.zenodo?.stats?.unique_downloads ??
                      "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DownloadIcon
                      sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      downloads
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent={"center"}>
              <Button
                onClick={handleDetailsToggle}
                startIcon={
                  !detailsToggle ? (
                    <KeyboardDoubleArrowDownIcon />
                  ) : (
                    <KeyboardDoubleArrowUpIcon />
                  )
                }
              >
                {!detailsToggle && "Show more"}
                {detailsToggle && "Show less"}
              </Button>
            </Stack>

            {detailsToggle && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                <TableContainer sx={{ maxWidth: 500 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "primary.text",
                            fontWeight: 600,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            color: "primary.text",
                            fontWeight: 600,
                          }}
                        >
                          This Version
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "primary.text",
                            fontWeight: 600,
                          }}
                        >
                          All Versions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell>
                          <Tooltip title="Views">
                            <VisibilityIcon
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.version_unique_views ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.unique_views ?? "N/A"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>
                          <Tooltip title="Downloads">
                            <DownloadIcon
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.version_unique_downloads ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.unique_downloads ?? "N/A"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ResourceGeographicCoverage({ resource }) {
  const [detailsToggle, setDetailsToggle] = useState(false);
  if (resource?.isLoading) {
    return (
      <Card sx={cardStyles}>
        <CardHeader
          sx={{ pb: 1 }}
          title={<Typography variant="h5">Geographical Coverage</Typography>}
        />
        <CardContent sx={{ textAlign: "center", pt: 4 }}>
          <CircularProgress size="3rem" />
        </CardContent>
      </Card>
    );
  }

  if (resource?.data?.data?.geographical_coverage.length === 0) {
    return (
      <Card sx={cardStyles}>
        <CardHeader
          sx={{ pb: 1 }}
          title={<Typography variant="h5">Geographical Coverage</Typography>}
        />
        <CardContent sx={{ pt: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No geographical coverage data available
          </Typography>
        </CardContent>
      </Card>
    );
  }
  const displayedCoverage = detailsToggle
    ? resource
    : resource?.data?.data?.geographical_coverage;

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Geographical Coverage</Typography>}
      />
      <CardContent sx={{ pt: 1 }}>
        <Grid container spacing={1} sx={{ pb: 1 }}>
          {displayedCoverage?.map((geo) => (
            <Grid item xs={3} key={geo.id}>
              <Chip
                label={
                  <Typography
                    noWrap
                    sx={{ maxWidth: "100%", display: "block" }}
                    title={geo.label}
                    variant="subtitle2"
                  >
                    {geo.label}
                  </Typography>
                }
                avatar={
                  <Avatar src={geo.flag} alt={geo.label}>
                    <span style={{ color: "white" }}>
                      {geo?.label.toUpperCase()[0]}
                    </span>
                  </Avatar>
                }
                variant="outlined"
                sx={{
                  width: "100%",
                  border: "none !important",
                }}
              />
            </Grid>
          ))}
        </Grid>
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
        height: "calc(100vh - 112px)",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, md: 4, lg: 6, xl: 8 },
        py: 2,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: { sm: "700px", md: "1000px", lg: "1400px", xl: "1600px" },
        }}
      >
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to={-1}
          startIcon={<ArrowBackIcon />}
          sx={{ width: "fit-content", backgroundColor: "#fff" }}
        >
          Back
        </Button>
        <Grid
          container
          spacing={4}
          sx={{
            minHeight: "100%",
          }}
        >
          {location.pathname.includes("dataset") && (
            <Dataset resourceId={resourceId} />
          )}
          {location.pathname.includes("documents") && (
            <Document resourceId={resourceId} />
          )}
          {location.pathname.includes("tools") && (
            <Tool resourceId={resourceId} />
          )}
          {location.pathname.includes("services") && (
            <Service resourceId={resourceId} />
          )}
        </Grid>
      </Stack>
    </Box>
  );
}
