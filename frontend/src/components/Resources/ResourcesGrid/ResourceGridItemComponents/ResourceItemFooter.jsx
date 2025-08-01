import { Typography, Stack, Tooltip, Avatar, AvatarGroup } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { formatDate } from "../../../../utils/utils";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FlagIcon from "@mui/icons-material/Flag";

export function ResourceItemScopes({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;
  return (
    <AvatarGroup
      sx={{ ml: 0 }}
      slotProps={{
        additionalAvatar: {
          sx: {
            width: SIZE,
            height: SIZE,
            fontSize: FONT_SIZE,
          },
        },
      }}
    >
      {resource?.scopes?.map((scope) => (
        <Tooltip key={scope?.id} title={scope?.description}>
          <Avatar
            alt={scope?.name}
            sx={{
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              bgcolor: scope.bg_color ?? "#EB611F",
            }}
          >
            {scope?.name?.toUpperCase()[0]}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}

export function ResourceItemAssessments({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;

  const getAssessmentIcon = (name) => {
    switch (name) {
      case "Researcher":
        return <PersonIcon fontSize="inherit" />;
      case "Researcher team/group":
        return <GroupIcon fontSize="inherit" />;
      case "Research organization":
        return <AccountBalanceIcon fontSize="inherit" />;
      default:
        return <FlagIcon fontSize="inherit" />;
    }
  };

  return (
    <AvatarGroup
      sx={{ ml: 0 }}
      slotProps={{
        additionalAvatar: {
          sx: {
            width: SIZE,
            height: SIZE,
            fontSize: FONT_SIZE,
          },
        },
      }}
    >
      {resource?.assessments?.map((assessment) => (
        <Tooltip key={assessment?.id} title={assessment?.description}>
          <Avatar
            alt={assessment?.name}
            sx={{
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              bgcolor: "grey.200",
              color: "text.primary",
            }}
          >
            {getAssessmentIcon(assessment?.name)}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}

export default function ResourceItemFooter({ resource, type }) {
  const MAX_AVATARS = 5;
  const SIZE = "1.1rem";
  const FONT_SIZE = "0.75rem";

  const geoEntries = Object.entries(resource?.geographical_coverage || {});
  const visibleGeos = geoEntries.slice(0, MAX_AVATARS);
  const hiddenGeos = geoEntries.slice(MAX_AVATARS);
  const publication_date =
    resource?.zenodo?.metadata?.publication_date || "N/A";
  const version =
    resource?.zenodo?.metadata?.version ||
    resource?.openaire?.metadata?.version ||
    "N/A";
  const license =
    resource?.zenodo?.metadata?.license?.id ||
    resource?.openaire?.metadata?.license ||
    "N/A";
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        {type !== "service" && (
          <>
            <Tooltip title="Publication date">
              <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {formatDate(publication_date)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Version">
                <HistoryIcon sx={{ fontSize: "1.1rem" }} />
              </Tooltip>
              <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                {version}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="License">
                <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
              </Tooltip>
              <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                {license}
              </Typography>
            </Stack>
          </>
        )}
        {type === "service" && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="TRL">
              <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {resource?.openaire?.metadata?.trl ?? "N/A"}
            </Typography>
            <Tooltip title="Version">
              <HistoryIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {version}
            </Typography>
          </Stack>
        )}

        <ResourceItemAssessments resource={resource} />
        <ResourceItemScopes resource={resource} />
        {resource?.geographical_coverage && (
          <AvatarGroup
            sx={{ ml: 2 }}
            slotProps={{
              additionalAvatar: {
                sx: {
                  width: SIZE,
                  height: SIZE,
                  fontSize: FONT_SIZE,
                },
              },
            }}
          >
            {visibleGeos.map(([geoId, geo]) => (
              <Tooltip key={geoId} title={geo.label || geoId}>
                <Avatar
                  alt={geo.label || geoId}
                  src={geo.flag}
                  sx={{
                    width: SIZE,
                    height: SIZE,
                    fontSize: FONT_SIZE,
                  }}
                >
                  {geo?.label.toUpperCase()[0]}
                </Avatar>
              </Tooltip>
            ))}

            {hiddenGeos.length > 0 && (
              <Tooltip
                title={hiddenGeos.map(([, geo]) => geo?.label || "").join(", ")}
              >
                <Avatar
                  sx={{
                    width: SIZE,
                    height: SIZE,
                    fontSize: FONT_SIZE,
                    ml: "-8px",
                    bgcolor: "grey.400",
                    zIndex: 1,
                    pointerEvents: "auto",
                  }}
                >
                  +{hiddenGeos?.length}
                </Avatar>
              </Tooltip>
            )}
          </AvatarGroup>
        )}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Downloads on Zenodo">
            <DownloadIcon sx={{ fontSize: "1.1rem" }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
            {resource?.zenodo?.stats?.unique_downloads ?? "N/A"}
          </Typography>
          <Tooltip title="Views on Zenodo">
            <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontSize: "0.95rem", mr: 2 }}>
            {resource?.zenodo?.stats?.unique_views ?? "N/A"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
