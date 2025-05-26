import {
  InputBase,
  Paper,
  Tooltip,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  Typography,
  Card,
  Box,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History"; // Add this import
import AssignmentIcon from "@mui/icons-material/Assignment"; // Add this import
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

export default function ZenodoForm({
  register,
  errors,
  zenodoData,
  onZenodoSearch,
  handleReset,
  isLoading,
}) {
  return (
    <>
      <Paper
        sx={{
          p: 0.5,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          {...register("source", {
            required: "Source cannot be empty",
            pattern: {
              value:
                /(?:https:\/\/zenodo\.org\/records\/\d+|\d{2}\.\d{4}\/zenodo\.\d+)/,
              message: "Not a valid Zenodo URL or DOI",
            },
          })}
          sx={{ pl: 1, flex: 1 }}
          placeholder="Zenodo source or DOI"
          error={!!errors?.source}
          inputProps={{ "aria-label": "Zenodo source or DOI" }}
        />
        <Tooltip title="Search Zenodo">
          <IconButton
            type="button"
            onClick={onZenodoSearch}
            sx={{ p: "10px", minWidth: "40px" }}
            aria-label="search"
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
          </IconButton>
        </Tooltip>

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

        <Tooltip title="Reset search">
          <IconButton
            type="button"
            onClick={handleReset}
            sx={{ p: "10px", minWidth: "40px" }}
            aria-label="reset"
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {errors?.source && (
        <div style={{ color: "red", fontSize: "0.8rem" }}>
          {errors.source.message}
        </div>
      )}

      {zenodoData && (
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
              <Link
                to={"https://zenodo.org/records/" + zenodoData?.zenodo_id}
                target="_blank"
              >
                {zenodoData?.title}
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
              <Tooltip title={zenodoData?.metadata?.description}>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      zenodoData?.metadata?.description
                    ),
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
                {zenodoData?.metadata?.publication_date && (
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    {new Date(
                      zenodoData?.metadata?.publication_date
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                )}
                {zenodoData?.metadata?.version && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Version">
                      <HistoryIcon sx={{ fontSize: "1.1rem" }} />
                    </Tooltip>
                    <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                      {zenodoData?.metadata?.version}
                    </Typography>
                  </Stack>
                )}
                {zenodoData?.metadata?.license?.id && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="License">
                      <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
                    </Tooltip>
                    <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                      {zenodoData?.metadata?.license?.id}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  );
}
