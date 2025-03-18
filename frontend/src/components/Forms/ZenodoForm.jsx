import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Notification from "../Notification.jsx";
import { useZenodo } from "../../queries/zenodo.js";
import { useCreateDataset } from "../../queries/dataset.js";

function ZenodoData({ zenodoData }) {
  const [displayAuthors, setDisplayAuthors] = useState(false);

  function handleDisplayAuthors() {
    setDisplayAuthors(!displayAuthors);
  }
  return (
    <DialogContent sx={{ p: 4, textAlign: "center", backgroundColor: "beige" }}>
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
          value={new Date(zenodoData?.publication_date).toLocaleDateString()}
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
      <Stack direction={"column"} useFlexGap>
        <TextField
          value={zenodoData?.metadata?.description}
          disabled
          label="Description"
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          onClick={handleDisplayAuthors}
          endIcon={displayAuthors ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          sx={{ mb: 2 }}
        >
          Authors
        </Button>
        {displayAuthors &&
          zenodoData?.metadata?.creators?.map((creator) => (
            <TextField
              value={creator?.name}
              disabled
              label="Author"
              sx={{ mb: 2 }}
            />
          ))}
      </Stack>
      <Link target="_blank" to={zenodoData?.doi_url}>
        View on Zenodo
      </Link>
    </DialogContent>
  );
}

function ZenodoForm({ zenodoData, setZenodoData, setMessage }) {
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
      <DialogContent sx={{ p: 2 }}>
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

export default function ResourceForm() {
  const [message, setMessage] = useState("");
  const [zenodoData, setZenodoData] = useState();
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, setErr },
  } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();
  const createDataset = useCreateDataset();

  useEffect(() => {
    setValue("source", zenodoData?.source);
  }, [zenodoData]);

  const onSubmit = (data) => {
    createDataset.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("Dataset has been created successfully!");
          setTimeout(() => {
            navigate("..");
          }, 1000);
        },
        onError: (error) => {
          reset();
          setMessage(error?.response?.detail);
          setError("source", {
            message: error?.response?.detail,
          });
        },
      }
    );
  };
  function handleClose() {
    navigate("..");
  }

  return (
    user && (
      <>
        <Dialog
          component="form"
          onClose={handleClose}
          open={true}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#338BCB",
              color: "white",
              textAlign: "center",
            }}
          >
            Create Resource
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>

          <ZenodoForm
            zenodoData={zenodoData}
            setZenodoData={setZenodoData}
            setMessage={setMessage}
          />

          <DialogActions sx={{ p: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!zenodoData}
              loading={createDataset?.isPending}
              endIcon={<AddIcon />}
              loadingPosition="end"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        {(createDataset?.isSuccess || createDataset?.isError) && (
          <Notification
            requestStatus={createDataset?.status}
            message={message}
          />
        )}
      </>
    )
  );
}
