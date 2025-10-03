import {
  InputBase,
  Paper,
  Tooltip,
  Divider,
  IconButton,
  CircularProgress,
  Stack,
  TextField,
  InputLabel,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
export default function ResourceFormSearch({
  form,
  onZenodoSearch,
  onOpenaireSearch,
  handleReset,
  isLoading,
  data,
  resourceType,
}) {
  const onClickHandler = () => {
    // function that checks if the source is an openaire url by matching the regex https://graspos-services.athenarc.gr/service/[a-zA-Z0-9_.-]+/overview
    const source = form?.getValues("source");
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
    <Stack direction="row" spacing={2} alignItems="center" pb={2}>
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Paper
          sx={{
            p: 0.5,
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputBase
            {...form?.register("source", {
              required: "Source cannot be empty",
              pattern: {
                value:
                  /(?:https:\/\/zenodo\.org\/records\/\d+|\d{2}\.\d{4}\/zenodo\.\d+|https:\/\/graspos-services\.athenarc\.gr\/service\/[a-zA-Z0-9_.-]+\/overview)/,
                message: "Not a valid Zenodo or Openaire URL or DOI",
              },
            })}
            sx={{ pl: 1, flex: 1 }}
            placeholder="Zenodo or Openaire source or DOI"
            error={!!form?.formState?.errors?.source}
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
      </Stack>
      {data && resourceType !== "service" && (
        <Stack direction="column">
          <TextField
            {...form.register("doi", {
              required: "DOI is required",
              pattern: {
                value: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
                message: "Not a valid DOI",
              },
            })}
            label="DOI"
            value={data?.doi || ""}
            error={!!form?.formState?.errors?.doi}
            fullWidth
            required
            disabled
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      )}
      {form?.formState?.errors?.source && (
        <div style={{ color: "red", fontSize: "0.8rem" }}>
          {form?.formState?.errors.source.message}
        </div>
      )}
    </Stack>
  );
}
