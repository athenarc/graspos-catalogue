import {
  DialogContent,
  Button,
  TextField,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useZenodo } from "../../queries/zenodo.js";

function ZenodoData({ zenodoData }) {
  const [displayAuthors, setDisplayAuthors] = useState(false);

  function handleDisplayAuthors() {
    setDisplayAuthors(!displayAuthors);
  }
  return (
    <DialogContent
      sx={{
        p: 2,
        pb: 0,
        textAlign: "center",
        mt: "0 !important;",
      }}
    >
      <Stack direction={"column"} spacing={2} useFlexGap>
        <TextField
          value={zenodoData?.title}
          disabled
          label="Title"
          fullWidth
          sx={{ mb: 2 }}
        />
      </Stack>
      <Stack direction={"row"} spacing={2} useFlexGap>
        <TextField
          value={zenodoData?.doi}
          disabled
          label="Zenodo DOI"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          value={new Date(
            zenodoData?.metadata?.publication_date
          ).toLocaleDateString()}
          disabled
          label="Publication Date"
          fullWidth
          sx={{ mb: 2 }}
        />
      </Stack>

      <Stack direction={"row"} spacing={2} useFlexGap>
        <TextField
          value={zenodoData?.metadata?.license?.id}
          disabled
          label="License"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          value={zenodoData?.metadata?.resource_type?.title}
          disabled
          label="Type"
          fullWidth
          sx={{ mb: 2 }}
        />
      </Stack>
      <Stack direction="column" useFlexGap spacing={2} alignItems="end">
        <Button
          onClick={handleDisplayAuthors}
          endIcon={displayAuthors ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          sx={{ mb: 2 }}
        >
          Authors
        </Button>
      </Stack>
      <Stack direction="column" useFlexGap spacing={2}>
        {displayAuthors &&
          zenodoData?.metadata?.creators?.map((creator) => (
            <TextField
              value={creator?.name}
              disabled
              label="Author"
              sx={{ mb: 2, width: "100%" }}
              fullWidth
            />
          ))}
      </Stack>
      <Stack direction={"column"} useFlexGap>
        <TextareaAutosize
          value={zenodoData?.metadata?.description}
          disabled
          label="Description"
          maxRows="4"
          minRows="4"
          sx={{ borderRadius: "20px !important" }}
        />
      </Stack>
    </DialogContent>
  );
}

export default function ZenodoForm({ zenodoData, setZenodoData, setMessage }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const zenodo = useZenodo();

  const onSubmit = (data) => {
    zenodo.mutate(
      { data },
      {
        onSuccess: (data) => {
          setZenodoData(data?.data);
          setMessage("Zendodo data received!");
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
          setError("source", {
            message: error?.response?.data?.detail,
          });
        },
      }
    );
  };
  function handleReset() {
    reset();
    setZenodoData();
  }

  return (
    <>
      <DialogContent sx={{ p: 2, mt: "0 !important;" }}>
        <TextField
          required
          {...register("source", {
            required: "Source can not be empty",
            pattern: {
              value: /^https:\/\/zenodo\.org\/records\/.*/,
              message: "Not a valid Zenodo URL",
            },
          })}
          label="Zenodo source"
          error={!!errors?.source}
          helperText={errors?.source?.message ?? " "}
          fullWidth
        />
        <Stack direction={"row"} spacing={2} justifyContent={"end"}>
          <Button
            variant="outlined"
            onClick={handleReset}
            endIcon={<RestartAltIcon />}
          >
            Reset
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            loading={zenodo?.isPending}
            endIcon={<SearchIcon />}
            loadingPosition="end"
          >
            Search
          </Button>
        </Stack>
      </DialogContent>
      {zenodoData && <ZenodoData zenodoData={zenodoData} />}
    </>
  );
}
