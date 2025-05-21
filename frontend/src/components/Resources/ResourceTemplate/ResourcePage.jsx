import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid2 as Grid,
  Grid2,
  Stack,
  Typography,
  Tooltip,
  Divider,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { Dataset } from "../Datasets/Datasets";
import { Document } from "../Documents/Documents";
import { Tool } from "../Tools/Tools";
import orcidLogo from "../../../assets/orcid.logo.icon.svg";
import { ResourceItemFooter } from "./ResourceGridItem";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Added import
import LaunchIcon from '@mui/icons-material/Launch'; // Added import
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

// Common card styles without transition and hover effect
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
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : '';
  };

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
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'inherit'
            }}
          >
            <Typography
              component="span"
              variant="h5"
              sx={{ 
                fontWeight: 'bold',
                color: 'rgb(174, 83, 142)',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {resource?.data?.data?.zenodo?.title ?? "Title"}
            </Typography>
            <LaunchIcon sx={{ 
              fontSize: '0.8em',
              color: 'rgb(174, 83, 142)'
            }} />
          </Link>
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Publication date">
              <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {formatDate(resource?.data?.data?.zenodo?.metadata?.publication_date)}
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
        </Stack>
      </Stack>

      {resource.isLoading && <CircularProgress size="3rem" />}
      {resource && (
        <Typography
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            margin: 0,
            fontSize: '0.875rem'
          }}
        >
          {resource?.data?.data?.zenodo?.metadata?.description}
        </Typography>
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
                      style={{ textDecoration: 'none' }}
                    >
                      <Stack direction="row" alignItems="center">
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            color: 'text.primary',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {author?.name}
                        </Typography>
                        <Avatar
                          sx={{ bgcolor: "#A6CE39", width: 20, height: 20, ml: 1 }}
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
                      fontStyle: "italic"
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
              <Grid2 container spacing={1}>
                {keywords?.map((keyword) => (
                  <Grid2 key={keyword}>
                    <Chip
                      label={keyword}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Grid2>
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
        {resource && (
          <Typography>
            {resource?.data?.data?.zenodo?.metadata?.license?.id}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function ResourceStatistics({ resource }) {
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">User Statistics</Typography>}
      />
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ width: '100%' }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ width: '50%', py: 2 }}
            >
              <Stack alignItems="center" spacing={1}>
                <Typography 
                  variant="h4" 
                  fontWeight="500" 
                  color="primary.main"
                >
                  {resource?.data?.data?.zenodo?.stats?.views ?? 0}
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                >
                  <VisibilityIcon sx={{ fontSize: "1.1rem", color: 'text.secondary' }} />
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
              sx={{ width: '50%', py: 2 }}
            >
              <Stack alignItems="center" spacing={1}>
                <Typography 
                  variant="h4" 
                  fontWeight="500" 
                  color="primary.main"
                >
                  {resource?.data?.data?.zenodo?.stats?.downloads ?? 0}
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                >
                  <DownloadIcon sx={{ fontSize: "1.1rem", color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    downloads
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
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
        height: "calc(100vh - 112px)",
        overflowY: "auto",
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2, md: 4, lg: 6, xl: 8 }, // Reduced padding
        py: 2,
      }}
    >
      <Stack 
        spacing={2}
        sx={{ 
          width: '100%',
          maxWidth: { sm: '700px', md: '1000px', lg: '1400px', xl: '1600px' }, // Increased max-width
        }}
      >
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to={-1}
          startIcon={<ArrowBackIcon />}
          sx={{ width: 'fit-content', backgroundColor: "#fff" }}
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
        </Grid>
      </Stack>
    </Box>
  );
}
