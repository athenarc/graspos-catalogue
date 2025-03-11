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
import { useCreateTool } from "../../queries/tool.js";
import { useState } from "react";
import Notification from "../Notification.jsx";

export default function ToolForm() {
  const [message, setMessage] = useState("");
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, setErr },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const createTool = useCreateTool();

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
            Create Tool
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
          <DialogContent sx={{ p: 2 }}>
            <TextField
              required
              {...register("source", {
                required: "Source can not be empty",
                pattern: {
                  value: /^https:\/\/zenodo\.org\/records\/.*/,
                  message: "Not a valid URL",
                },
              })}
              label="Zenodo source"
              error={!!errors?.source}
              helperText={errors?.source?.message ?? " "}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={createTool?.isPending || createTool?.isSuccess}
            >
              {createTool?.isPending ? (
                <>
                  Creating Tool
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
        {(createTool?.isSuccess || createTool?.isError) && (
          <Notification requestStatus={createTool?.status} message={message} />
        )}
      </>
    )
  );
}
