import { Typography, Stack, Tooltip, Avatar, AvatarGroup } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

import { formatDate } from "@utils/utils";
import { renderIcon } from "@helpers/MenuItems";

const resourcesDisplayFieldsFirst = [
  {
    publication_date: {
      label: "Publication Date",
      icon: CalendarMonthIcon,
      resources: ["dataset", "tool", "document"],
    },
  },
  {
    version: {
      label: "Version",
      icon: HistoryIcon,
      resources: ["dataset", "tool", "document", "service"],
    },
  },
  {
    license: {
      label: "License",
      icon: AssignmentIcon,
      resources: ["dataset", "tool", "document", "service"],
    },
  },
  {
    trl: {
      label: "Technology Readiness Level (TRL)",
      icon: HistoryIcon,
      resources: ["tool", "service"],
    },
  },
];

const resourcesDisplayAssessmentFields = [
  {
    scopes: { resources: ["dataset", "tool", "document", "service"] },
  },
  {
    assessments: { resources: ["dataset", "tool", "document", "service"] },
  },
  {
    geographical_coverage: {
      resources: ["dataset", "tool", "document", "service"],
    },
  },
];

const resourcesDisplayFieldsSecond = [
  {
    downloads: {
      label: "Downloads on Zenodo",
      icon: DownloadIcon,
      resources: ["dataset", "tool", "document"],
    },
  },
  {
    views: {
      label: "Views on Zenodo",
      icon: VisibilityIcon,
      resources: ["dataset", "tool", "document"],
    },
  },
  {
    citations: {
      label: "Citations",
      icon: FormatQuoteIcon,
      resources: ["dataset", "tool", "document"],
    },
  },
];

function ResourceItemScopes({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;

  return (
    resource?.scopes.length > 0 && (
      <AvatarGroup
        sx={{ marginLeft: "0px !important;" }}
        slotProps={{
          additionalAvatar: {
            sx: {
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              pointerEvents: "auto",
            },
          },
        }}
      >
        {resource?.scopes?.map((scope) => (
          <Tooltip key={scope?.id} title={scope?.description}>
            <Avatar
              sx={{
                width: SIZE,
                height: SIZE,
                fontSize: FONT_SIZE,
                bgcolor: scope.bg_color ?? "#EB611F",
              }}
            >
              {scope?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    )
  );
}

function ResourceItemAssessments({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;

  return (
    resource?.assessments?.length > 0 && (
      <AvatarGroup
        sx={{ marginLeft: "0px !important;" }}
        slotProps={{
          additionalAvatar: {
            sx: {
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              pointerEvents: "auto",
            },
          },
        }}
      >
        {resource?.assessments?.map((assessment) => (
          <Tooltip key={assessment?.id} title={assessment?.description}>
            <Avatar
              sx={{
                width: SIZE,
                height: SIZE,
                fontSize: FONT_SIZE,
                bgcolor: "grey.200",
                color: "text.primary",
              }}
            >
              {renderIcon(assessment?.name)}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    )
  );
}

function ResourceItemGeographicalCoverage({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;

  const entries = Object.entries(resource?.geographical_coverage || {});
  const visible = entries.slice(0, 5);
  const hidden = entries.slice(5);

  return (
    entries?.length > 0 && (
      <AvatarGroup
        sx={{ marginLeft: "0px !important;" }}
        slotProps={{
          additionalAvatar: {
            sx: {
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              pointerEvents: "auto",
            },
          },
        }}
      >
        {visible.map(([id, geo]) => (
          <Tooltip key={id} title={geo.label || id}>
            <Avatar src={geo.flag} sx={{ width: SIZE, height: SIZE }} />
          </Tooltip>
        ))}

        {hidden.length > 0 && (
          <Tooltip title={hidden.map(([, g]) => g.label).join(", ")}>
            <Avatar
              sx={{
                width: SIZE,
                height: SIZE,
                fontSize: FONT_SIZE,
                bgcolor: "grey.400",
              }}
            >
              +{hidden.length}
            </Avatar>
          </Tooltip>
        )}
      </AvatarGroup>
    )
  );
}

function ResourceItemAssessmentFields({ resource, type }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
      {resourcesDisplayAssessmentFields.map((field) => {
        const key = Object.keys(field)[0];
        const cfg = field[key];

        if (!cfg.resources.includes(type)) return null;

        if (key === "scopes")
          return <ResourceItemScopes key={key} resource={resource} />;
        if (key === "assessments")
          return <ResourceItemAssessments key={key} resource={resource} />;
        if (key === "geographical_coverage")
          return (
            <ResourceItemGeographicalCoverage key={key} resource={resource} />
          );

        return null;
      })}
    </Stack>
  );
}

export default function ResourceItemFooter({ resource, type }) {
  const ICON_SIZE = { xs: "1rem", sm: "1.15rem" };
  const FONT_SIZE = { xs: "0.7rem", sm: "0.85rem" };

  const publicationDate = resource?.zenodo?.metadata?.publication_date
    ? formatDate(resource?.zenodo?.metadata?.publication_date)
    : "N/A";

  const version =
    resource?.zenodo?.metadata?.version ||
    resource?.openaire?.metadata?.version ||
    "N/A";

  const license =
    resource?.zenodo?.metadata?.license?.id ||
    resource?.openaire?.metadata?.license ||
    "N/A";

  const trl = resource?.trl?.trl_id
    ? `${resource?.trl?.trl_id} - ${resource?.trl?.european_description}`
    : "N/A";

  return (
    <Stack gap={{ xs: 1, sm: 2 }}>
      <ResourceItemAssessmentFields resource={resource} type={type} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack
          direction="row"
          gap={{ xs: 1, sm: 2 }}
          flexWrap="wrap"
          alignItems="center"
        >
          {resourcesDisplayFieldsFirst?.map((field) => {
            const [key, cfg] = Object.entries(field)[0];
            if (!cfg?.resources?.includes(type)) return null;

            return (
              <Stack
                key={key}
                direction="row"
                gap={{ xs: 0.5, sm: 1 }}
                alignItems="center"
              >
                <Tooltip title={cfg?.label}>
                  <cfg.icon
                    sx={{ fontSize: ICON_SIZE, color: "text.secondary" }}
                  />
                </Tooltip>

                <Typography sx={{ fontSize: FONT_SIZE }}>
                  {key === "publication_date" && publicationDate}
                  {key === "version" && version}
                  {key === "license" && license}
                  {key === "trl" && trl}
                </Typography>
              </Stack>
            );
          })}
        </Stack>

        <Stack
          direction="row"
          gap={{ xs: 1, sm: 2 }}
          flexWrap="wrap"
          justifyContent="flex-end"
          alignItems="center"
        >
          {resourcesDisplayFieldsSecond?.map((field) => {
            const [key, cfg] = Object?.entries(field)[0];
            if (!cfg?.resources?.includes(type)) return null;

            return (
              <Stack
                key={key}
                direction="row"
                gap={{ xs: 0.5, sm: 1 }}
                alignItems="center"
              >
                <Tooltip title={cfg?.label}>
                  <cfg.icon
                    sx={{ fontSize: ICON_SIZE, color: "text.secondary" }}
                  />
                </Tooltip>

                <Typography sx={{ fontSize: FONT_SIZE }}>
                  {key === "downloads" &&
                    (resource?.zenodo?.stats?.unique_downloads ?? "N/A")}
                  {key === "views" &&
                    (resource?.zenodo?.stats?.unique_views ?? "N/A")}
                  {key === "citations" &&
                    (resource?.zenodo?.indicators?.citationImpact
                      ?.citationCount ??
                      "N/A")}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}
