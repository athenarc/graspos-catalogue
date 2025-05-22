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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

const cardStyles = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 1,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            sx={{ p: 1 }}
            aria-label="search"
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
          </IconButton>
        </Tooltip>

        <Divider
          sx={{ height: 28, m: 0.5, display: isMobile ? "none" : "block" }}
          orientation="vertical"
        />

        <Tooltip title="Reset search">
          <IconButton
            type="button"
            onClick={handleReset}
            sx={{ p: 1 }}
            aria-label="reset"
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {errors?.source && (
        <Typography color="error" fontSize="0.8rem" mt={0.5}>
          {errors.source.message}
        </Typography>
      )}

      {zenodoData && (
        <Card component={Stack} spacing={1} sx={{ ...cardStyles, mt: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "rgb(174, 83, 142)" }}
          >
            Preview
          </Typography>

          <Typography variant="subtitle2">
            <Link
              to={`https://zenodo.org/records/${zenodoData.zenodo_id}`}
              target="_blank"
            >
              {zenodoData.title}
            </Link>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 6,
              WebkitBoxOrient: "vertical",
            }}
          >
            <Tooltip title={zenodoData.metadata?.description ?? ""}>
              <Box
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    zenodoData.metadata?.description || ""
                  ),
                }}
              />
            </Tooltip>
          </Typography>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1 : 2}
            alignItems="center"
          >
            {zenodoData.metadata?.publication_date && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Publication date">
                  <CalendarMonthIcon fontSize="small" />
                </Tooltip>
                <Typography variant="caption">
                  {new Date(
                    zenodoData.metadata.publication_date
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </Stack>
            )}

            {zenodoData.metadata?.version && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Version">
                  <HistoryIcon fontSize="small" />
                </Tooltip>
                <Typography variant="caption">
                  {zenodoData.metadata.version}
                </Typography>
              </Stack>
            )}

            {zenodoData.metadata?.license?.id && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="License">
                  <AssignmentIcon fontSize="small" />
                </Tooltip>
                <Typography variant="caption">
                  {zenodoData.metadata.license.id}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Card>
      )}
    </>
  );
}
