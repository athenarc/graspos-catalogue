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
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Notification from "../Notification.jsx";
import { useZenodo } from "../../queries/zenodo.js";

export default function ZenodoForm() {
  const [message, setMessage] = useState("");
  const [zenodoData, setZenodoData] = useState();
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, setErr },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
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
  function handleClose() {
    navigate("..");
  }
  function handleReset() {
    reset();
    setZenodoData();
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
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#338BCB",
              color: "white",
              textAlign: "center",
            }}
          >
            Create Dataset
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
          <DialogContent sx={{ p: 2, pb: 0 }}>
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
          </DialogContent>
          {zenodoData && (
            <DialogContent
              component={Stack}
              direction={"row"}
              sx={{ p: 2, textAlign: "center" }}
            >
              <TextField
                value={zenodoData?.doi}
                disabled
                label="Zenodo DOI"
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                value={zenodoData?.metadata?.title}
                disabled
                label="Title"
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                value={zenodoData?.metadata?.description}
                disabled
                label="Description"
                fullWidth
                sx={{ mb: 2 }}
              />
              {zenodo?.isSuccess && (
                <Link
                  target="_blank"
                  to={zenodoData?.doi_url}
                  type="submit"
                  variant="contained"
                >
                  View on Zenodo
                </Link>
              )}
            </DialogContent>
          )}

          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              variant="contained"
              onClick={handleReset}
              endIcon={<RestartAltIcon />}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={zenodo?.isPending}
              endIcon={<AddIcon />}
              loadingPosition="end"
            >
              Search
            </Button>
          </DialogActions>
        </Dialog>
        {(zenodo?.isSuccess || zenodo?.isError) && (
          <Notification requestStatus={zenodo?.status} message={message} />
        )}
      </>
    )
  );
}
