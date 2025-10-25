import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { sanitizeHtml, formatDate } from "../../../../utils/utils";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LoadingComponent from "@helpers/LoadingComponent";
import { ResourceItemKeywords } from "../ResourceGridItemComponents/ResourceItemContent";

export function ResourcePageTitle({ resource, type }) {
  const url =
    type === "service"
      ? resource?.data?.data?.openaire?.source
      : "https://zenodo.org/records/" + resource?.data?.data?.zenodo?.zenodo_id;
  const title =
    resource?.data?.data?.zenodo?.title ||
    resource?.data?.data?.openaire?.metadata?.name ||
    "Title";
  const resourceType =
    resource?.data?.data?.resource_type?.toLowerCase() === "document"
      ? "Templates & Guidelines"
      : resource?.data?.data?.resource_type?.toLowerCase();

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "rgb(174, 83, 142)" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Link to={url} target="_blank" rel="noopener noreferrer">
            <Tooltip title="Open resource in new tab">
              <LinkIcon
                sx={{ color: "text.primary", verticalAlign: "middle" }}
              />
            </Tooltip>
          </Link>
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "text.secondary",
            px: 1,
            borderRadius: 1,
          }}
        >
          {resourceType?.[0]?.toUpperCase() + resourceType?.slice(1)}
        </Typography>
      </Stack>
    </>
  );
}

export function ResourcePageBasicInformationHeader({ resource, type }) {
  return (
    <Stack spacing={1} sx={{ px: 1 }}>
      <Stack direction="row" spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>version: </Typography>
        <Typography>
          {resource?.data?.data?.zenodo?.metadata?.version ||
            resource?.data?.data?.openaire?.metadata?.version ||
            "N/A"}
        </Typography>

        <Typography>
          (
          {formatDate(resource?.data?.data?.zenodo?.metadata?.publication_date)}
          )
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>doi: </Typography>
        <Typography>{resource?.data?.data?.zenodo?.doi || "N/A"}</Typography>
        <Typography>
          (all versions: {resource?.data?.data?.zenodo?.conceptdoi || "N/A"})
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>access rights: </Typography>
        <Typography>
          {resource?.data?.data?.zenodo?.metadata?.access_right || "N/A"}
        </Typography>
        <Divider orientation="vertical" flexItem />

        <Typography sx={{ fontWeight: "bold" }}>license: </Typography>
        <Typography>
          {resource?.data?.data?.zenodo?.metadata?.license?.id || "N/A"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>TRL: </Typography>
        <Typography>{resource?.data?.data?.trl?.trl_id || "N/A"}</Typography>
        <Divider orientation="vertical" flexItem />

        <Typography sx={{ fontWeight: "bold" }}>language: </Typography>
        <Typography>
          {resource?.data?.data?.zenodo?.metadata?.language || "N/A"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontWeight: "bold", pr: 1 }}>keywords: </Typography>
        <ResourceItemKeywords
          resource={resource?.data?.data}
          showIcon={false}
        />
      </Stack>
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

export function ResourcePageDescription({ resource, initialLines = 10 }) {
  const [expanded, setExpanded] = useState(false);
  const [truncatedHtml, setTruncatedHtml] = useState("");

  const description =
    resource?.data?.data?.zenodo?.metadata?.description ||
    resource?.data?.data?.openaire?.metadata?.description ||
    "No description available.";

  useEffect(() => {
    if (!description) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizeHtml(description);

    let lineCount = 0;
    const truncatedNodes = [];

    tempDiv.childNodes.forEach((node) => {
      if (lineCount >= initialLines) return;

      const textLines = node.textContent
        .split("\n")
        .filter((l) => l.trim() !== "");
      const remainingLines = initialLines - lineCount;

      if (textLines.length <= remainingLines) {
        truncatedNodes.push(node.outerHTML || node.textContent);
        lineCount += textLines.length;
      } else {
        const tempNode = node.cloneNode(true);
        tempNode.textContent = textLines.slice(0, remainingLines).join("\n");
        truncatedNodes.push(tempNode.outerHTML);
        lineCount += remainingLines;
      }
    });

    setTruncatedHtml(truncatedNodes.join(""));
  }, [description, initialLines]);

  if (!description) return null;

  return (
    <Box
      sx={{
        position: "relative",
        mt: 2,
        borderRadius: 1,
        padding: 2,
        borderColor: "divider",
        borderStyle: "solid",
        borderWidth: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          margin: 0,
          fontFamily: "inherit",
        }}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: expanded ? sanitizeHtml(description) : truncatedHtml,
          }}
        />
      </Typography>

      {description.split("\n").length > initialLines && (
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ mt: 1, float: "right" }}
        >
          {expanded ? "Display less" : "Display more"}
        </Button>
      )}
    </Box>
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
    <>
      {resource.isLoading && (
        <LoadingComponent loadingMessage="Loading resource ..." />
      )}
      {resource?.isSuccess && (
        <Stack spacing={2} sx={{ width: "100%" }}>
          <ResourcePageTitle resource={resource} type={type} />

          <ResourcePageBasicInformationHeader resource={resource} type={type} />

          {resource && <ResourcePageDescription resource={resource} />}
        </Stack>
      )}
    </>
  );
}
