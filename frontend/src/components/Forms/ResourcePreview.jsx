import { Tooltip, Stack, Typography, Card, Box } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

const cardStyles = {
  flexDirection: "column",
  display: "flex",
  borderRadius: "5px",
  border: "1px solid #e0dfdf",
  backgroundColor: "#f8faff",
  boxShadow: 0,
  color: "#555",
  p: 2,
};

export default function ResourcePreview({ data }) {
  const name = data?.metadata?.name || data?.title || "";
  const url = data?.source || `https://zenodo.org/records/${data?.zenodo_id}`;
  const description = data?.metadata?.description || data?.description || "";
  const publicationDate = data?.metadata?.publication_date
    ? new Date(data?.metadata?.publication_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const version = data?.metadata?.version;
  const license = data?.metadata?.license;
  return (
    data && (
      <Card p={2} sx={cardStyles}>
        <Stack direction="column" spacing={1}>
          <Typography
            component="span"
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "rgb(174, 83, 142)",
            }}
          >
            Preview
          </Typography>
          <Typography variant="subtitle">
            <Link to={url} target="_blank">
              {name}
            </Link>
          </Typography>
          <Typography
            variant="subtitle"
            sx={{
              variant: "paragraph",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "6",
              WebkitBoxOrient: "vertical",
              mt: "0 !important",
              [`& .tooltip`]: {
                maxWidth: 2000,
              },
            }}
          >
            <Tooltip title={description}>
              <Box
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(description),
                }}
              />
            </Tooltip>
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="Publication date">
                <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
              </Tooltip>
              {data?.metadata?.publication_date && (
                <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                  {publicationDate}
                </Typography>
              )}
              {version && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Version">
                    <HistoryIcon sx={{ fontSize: "1.1rem" }} />
                  </Tooltip>
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    {version}
                  </Typography>
                </Stack>
              )}
              {license && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="License">
                    <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
                  </Tooltip>
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    {license?.id}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Card>
    )
  );
}
