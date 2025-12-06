import {
  InputBase,
  Paper,
  Tooltip,
  Divider,
  IconButton,
  CircularProgress,
  Stack,
  Fade,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";

export default function ResourceFormSearch({
  form,
  onZenodoSearch,
  onOpenaireSearch,
  handleReset,
  isLoading,
  data,
  setStatus,
  setMessage,
}) {
  const sourceValue = form?.getValues("source")?.trim();

  // Disable search button if input is empty, invalid, loading or has data
  const disableSearch =
    isLoading ||
    !sourceValue ||
    !!form?.formState?.errors?.source ||
    data !== null;

  useEffect(() => {
    const subscription = form?.watch((value, { name, type }) => {
      if (name === "source" && type === "change") {
        form.clearErrors("source");
        // setStatus?.(null);
        // setMessage?.("");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setStatus, setMessage]);

  const onClickHandler = async () => {
    const isValid = await form.trigger("source");
    if (!isValid) {
      setStatus?.("warning");
      setMessage?.("Please enter a valid Zenodo or OpenAIRE link or DOI.");
      return;
    }

    const source = form.getValues("source").trim();
    setStatus?.("info");
    setMessage?.("Searching for resource metadata...");

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

  const onResetHandler = () => {
    handleReset();
    form.resetField("source");
    setStatus?.(null);
    setMessage?.("");
  };

  return (
    <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
      <Paper
        sx={{
          p: 0.5,
          display: "flex",
          alignItems: "center",
          width: "100%",
          boxShadow: 1,
          borderRadius: 2,
        }}
      >
        <InputBase
          {...form?.register("source", {
            required: "Please enter a Zenodo or OpenAIRE link or DOI.",
            pattern: {
              value:
                /(?:https:\/\/zenodo\.org\/records\/\d+|\d{2}\.\d{4}\/zenodo\.\d+|https:\/\/graspos-services\.athenarc\.gr\/service\/[a-zA-Z0-9_.-]+\/overview)/,
              message:
                "That doesn’t look like a valid Zenodo or OpenAIRE source.",
            },
          })}
          sx={{ pl: 1, flex: 1 }}
          placeholder={
            isLoading
              ? "Searching for resource..."
              : "Paste Zenodo or OpenAIRE URL or DOI"
          }
          disabled={isLoading || data !== null}
          inputProps={{
            "aria-label": "Zenodo or OpenAIRE source or DOI",
          }}
        />

        <Tooltip title="Search for resource">
          <span>
            <IconButton
              type="button"
              onClick={onClickHandler}
              sx={{ p: "10px", minWidth: "40px" }}
              aria-label="search"
              disabled={disableSearch}
              color="primary"
            >
              {isLoading ? (
                <Fade in={isLoading}>
                  <CircularProgress size={22} />
                </Fade>
              ) : (
                <SearchIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

        <Tooltip title="Clear field and reset search">
          <span>
            <IconButton
              type="button"
              onClick={onResetHandler}
              sx={{ p: "10px", minWidth: "40px" }}
              aria-label="reset"
              disabled={isLoading}
            >
              <RestartAltIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>
    </Stack>
  );
}
