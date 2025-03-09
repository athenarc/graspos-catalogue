import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateDataset } from "../../queries/dataset.js";
import { useState } from "react";
import Notification from "../Notification.jsx";

export default function DatasetForm() {
  const [message, setMessage] = useState("");
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, setErr },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const createDataset = useCreateDataset();

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
          setMessage(error?.response?.data?.detail);
          setError("title", {
            message: error?.response?.data?.detail,
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
          <DialogContent sx={{ p: 3, pt: 1.5, minWidth: 300 }}>
            <TextField
              required
              {...register("source", {
                required: "Source can not be empty",
                pattern: {
                  value:
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                  message: "Not a valid URL",
                },
              })}
              label="Zenodo source"
              error={!!errors?.source}
              helperText={errors?.source?.message ?? " "}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pt: 0, pb: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={createDataset?.isPending || createDataset?.isSuccess}
            >
              {createDataset?.isPending ? (
                <>
                  Creating Dataset
                  <CircularProgress size="13px" sx={{ ml: 1 }} />
                </>
              ) : (
                <>
                  Create
                  <AddIcon sx={{ ml: 1 }} />
                </>
              )}
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
