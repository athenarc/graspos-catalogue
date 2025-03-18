import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Notification from "../Notification.jsx";
import { useCreateDataset } from "../../queries/dataset.js";
import ZenodoForm from "./ZenodoForm.jsx";

export default function DatasetForm() {
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
