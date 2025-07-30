import {
  InputBase,
  Paper,
  Tooltip,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
export default function ResourceFormSearch({
  register,
  errors,
  getValues,
  onZenodoSearch,
  onOpenaireSearch,
  handleReset,
  isLoading,
}) {
  const onClickHandler = () => {
    // function that checks if the source is an openaire url by matching the regex https://graspos-services.athenarc.gr/service/[a-zA-Z0-9_.-]+/overview
    const source = getValues("source");

    if (
      source.match(
        /https:\/\/graspos-services\.athenarc\.gr\/service\/[a-zA-Z0-9_.-]+\/overview/
      )
    ) {
      onOpenaireSearch(source);
    } else {
      onZenodoSearch(source);
    }
  };
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
                /(?:https:\/\/zenodo\.org\/records\/\d+|\d{2}\.\d{4}\/zenodo\.\d+|https:\/\/graspos-services\.athenarc\.gr\/service\/[a-zA-Z0-9_.-]+\/overview)/,
              message: "Not a valid Zenodo or Openaire URL or DOI",
            },
          })}
          sx={{ pl: 1, flex: 1 }}
          placeholder="Zenodo or Openaire source or DOI"
          error={!!errors?.source}
          inputProps={{ "aria-label": "Zenodo or Openaire source or DOI" }}
        />
        <Tooltip title="Search Zenodo or Openaire">
          <IconButton
            type="button"
            onClick={onClickHandler}
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
    </>
  );
}
