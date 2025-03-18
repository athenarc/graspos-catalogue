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
import ZenodoForm from "./ZenodoForm.jsx";
import { useCreateTool } from "../../queries/tool.js";

export default function ToolForm() {
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
  const createTool = useCreateTool();

  useEffect(() => {
    setValue("source", zenodoData?.source);
  }, [zenodoData]);

  const onSubmit = (data) => {
    createTool.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("Tool has been created successfully!");
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
              loading={createTool?.isPending}
              endIcon={<AddIcon />}
              loadingPosition="end"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        {(createTool?.isSuccess || createTool?.isError) && (
          <Notification requestStatus={createTool?.status} message={message} />
        )}
      </>
    )
  );
}
