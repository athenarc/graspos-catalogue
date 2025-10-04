import {
  InputBase,
  Paper,
  Tooltip,
  Divider,
  IconButton,
  CircularProgress,
  Stack,
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
}) {
  const disableSearch =
    isLoading ||
    form?.getValues("source")?.trim() === "" ||
    !!form?.formState?.errors?.source ||
    data !== null;

  const onClickHandler = async () => {
    // Trigger validation του πεδίου πριν τρέξει search
    const isValid = await form.trigger("source");
    if (!isValid) return; // Αν δεν είναι valid, μην κάνεις search

    const source = form.getValues("source").trim();
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
      <Stack direction="row" sx={{ flexGrow: 1 }}>
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
              required: "Resource source cannot be empty",
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
            disabled={isLoading || data !== null}
          />
          <Tooltip title="Search Zenodo or Openaire">
            <IconButton
              type="button"
              onClick={onClickHandler}
              sx={{ p: "10px", minWidth: "40px" }}
              aria-label="search"
              disabled={disableSearch}
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
      {form?.formState?.errors?.source && (
        <div style={{ color: "red", fontSize: "0.8rem" }}>
          {form?.formState?.errors?.source?.message}
        </div>
      )}
    </>
  );
}
