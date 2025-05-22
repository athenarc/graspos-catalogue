import {
  Button,
  TextField,
  Stack,
  TextareaAutosize,
  Grid2,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useZenodo } from "../../queries/zenodo.js";

function ZenodoData({ zenodoData }) {
  const [displayAuthors, setDisplayAuthors] = useState(false);

  function handleDisplayAuthors() {
    setDisplayAuthors(!displayAuthors);
  }
  return (
    <Stack direction={"column"} spacing={2} useFlexGap>
      <TextField value={zenodoData?.title} disabled label="Title" fullWidth />
      <TextareaAutosize
        value={zenodoData?.metadata?.description}
        disabled
        label="Description"
        maxRows="4"
        minRows="4"
        sx={{ borderRadius: "20px !important" }}
      />
      <Stack direction={"row"} spacing={2} useFlexGap>
        <TextField
          value={zenodoData?.doi}
          disabled
          label="Zenodo DOI"
          fullWidth
        />
        <TextField
          value={new Date(
            zenodoData?.metadata?.publication_date
          ).toLocaleDateString()}
          disabled
          label="Publication Date"
          fullWidth
        />
      </Stack>

      <Stack direction={"row"} spacing={2} useFlexGap>
        <TextField
          value={zenodoData?.metadata?.license?.id}
          disabled
          label="License"
          fullWidth
        />
        <TextField
          value={zenodoData?.metadata?.resource_type?.title}
          disabled
          label="Type"
          fullWidth
        />
      </Stack>

      <Button
        onClick={handleDisplayAuthors}
        endIcon={displayAuthors ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        Authors
      </Button>

      {displayAuthors && (
        <Grid2 container spacing={2}>
          {zenodoData?.metadata?.creators?.map((creator) => (
            <Grid2 size={4}>
              <TextField
                value={creator?.name}
                disabled
                label="Author"
                title={creator?.name}
              />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Stack>
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
    <Stack direction="column" spacing={2}>
      <TextField
        required
        {...register("source", {
          required: "Source can not be empty",
          pattern: {
            value: /(?:https:\/\/zenodo\.org\/records\/\d{8}|\d{2}\.\d{4}\/zenodo\.\d{8})/,
            message: "Not a valid Zenodo URL",
          },
        })}
        label="Zenodo source or DOI"
        error={!!errors?.source}
        helperText={errors?.source?.message ?? " "}
        fullWidth
      />
      <Stack
        direction={"row"}
        spacing={2}
        justifyContent={"end"}
        sx={{ mt: "0 !important" }}
      >
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
      {zenodoData && <ZenodoData zenodoData={zenodoData} />}
    </Stack>
  );
}
