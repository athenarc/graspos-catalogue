import { CircularProgress, Stack, Typography, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { ResourceItemScopes } from "../ResourceGridItemComponents/ResourceItemFooter";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { sanitizeHtml, formatDate } from "../../../../utils/utils";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export function ResourcePageTitle({ resource, type }) {
  const url =
    type === "service"
      ? resource?.data?.data?.openaire?.source
      : "https://zenodo.org/records/" + resource?.data?.data?.zenodo?.zenodo_id;
  const title =
    resource?.data?.data?.zenodo?.title ||
    resource?.data?.data?.openaire?.metadata?.name ||
    "Title";
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="h5" component="div">
        <Link to={url} target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
      </Typography>
    </Stack>
  );
}

export function ResourceVisibility({ resource }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Visibility">
        <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
      </Tooltip>
      <Typography variant="body2" color="text.secondary">
        {resource?.visibility ?? "N/A"}
      </Typography>
    </Stack>
  );
}

export function ResourcePageDescription({ resource }) {
  return (
    <Typography
      variant="body2"
      sx={{
        margin: 0,
        fontFamily: "inherit",
      }}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(
          resource?.data?.data?.zenodo?.metadata?.description ||
            resource?.data?.data?.openaire?.metadata?.description ||
            "No description available."
        ),
      }}
    />
  );
}

export function ResourcePagePublicationDate({ resource }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Publication date">
        <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
      </Tooltip>
      <Typography variant="body2" color="text.secondary">
        {formatDate(resource?.data?.data?.zenodo?.metadata?.publication_date)}
      </Typography>
    </Stack>
  );
}

export function ResourcePageVersion({ resource }) {
  const version =
    resource?.data?.data?.zenodo?.metadata?.version ||
    resource?.data?.data?.openaire?.metadata?.version ||
    "N/A";
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Version">
        <HistoryIcon sx={{ fontSize: "1.1rem" }} />
      </Tooltip>
      <Typography variant="body2" color="text.secondary">
        Version {version}
      </Typography>
    </Stack>
  );
}

export function ResourcePageServiceType({ resource }) {
  const serviceType = resource?.data?.data?.service_type || "N/A";
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Service type">
        <Inventory2Icon sx={{ fontSize: "1.1rem" }} />
      </Tooltip>
      <Typography variant="body2" color="text.secondary">
        {serviceType}
      </Typography>
    </Stack>
  );
}

export function ResourceBasicInformation({ resource, type }) {
  const url =
    type === "service"
      ? resource?.data?.data?.openaire?.source
      : "https://zenodo.org/records/" + resource?.data?.data?.zenodo?.zenodo_id;
  const title =
    resource?.data?.data?.zenodo?.title ||
    resource?.data?.data?.openaire?.metadata?.name ||
    "Title";
  const version =
    resource?.data?.data?.zenodo?.metadata?.version ||
    resource?.data?.data?.openaire?.metadata?.version ||
    "N/A";
  return (
    <Stack spacing={3}>
      <Stack direction="column" spacing={2}>
        <ResourcePageTitle resource={resource} type={type} />
        <Stack direction="row" spacing={2} alignItems="center">
          {type !== "service" && (
            <ResourcePagePublicationDate resource={resource} />
          )}
          <ResourcePageVersion resource={resource} />
          {type === "dataset" && <ResourceVisibility resource={resource} />}
          {type === "service" && (
            <ResourcePageServiceType resource={resource} />
          )}

          <ResourceItemScopes resource={resource?.data?.data} />
        </Stack>
      </Stack>
      {resource.isLoading && <CircularProgress size="3rem" />}
      {resource && <ResourcePageDescription resource={resource} />}
    </Stack>
  );
}
