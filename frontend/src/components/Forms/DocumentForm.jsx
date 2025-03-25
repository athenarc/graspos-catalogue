import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Notification from "../Notification.jsx";
import ZenodoForm from "./ZenodoForm.jsx";
import { useCreateDocument } from "../../queries/document.js";

export default function DocumentForm() {
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
  const createDocument = useCreateDocument();

  useEffect(() => {
    setValue("source", zenodoData?.source);
  }, [zenodoData]);

  const onSubmit = (data) => {
    createDocument.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("Document has been created successfully!");
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
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              backgroundColor: "#20477B",
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

          <DialogContent sx={{ p: 2 }}>
            <ZenodoForm
              zenodoData={zenodoData}
              setZenodoData={setZenodoData}
              setMessage={setMessage}
            />
            {zenodoData && (
              <Stack direction="row" useFlexGap spacing={2} sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    {...register("format")}
                    label="Format"
                    fullWidth
                    defaultValue="csv"
                  >
                    <MenuItem value={"csv"}>CSV</MenuItem>
                    <MenuItem value={"pdf"}>PDF</MenuItem>
                    <MenuItem value={"xls"}>XLS</MenuItem>
                    <MenuItem value={"json"}>JSON</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}
          </DialogContent>

          {zenodoData && (
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!zenodoData}
                loading={createDocument?.isPending}
                endIcon={<AddIcon />}
                loadingPosition="end"
                sx={{ backgroundColor: "#20477B" }}
              >
                Create
              </Button>
            </DialogActions>
          )}
        </Dialog>

        {(createDocument?.isSuccess || createDocument?.isError) && (
          <Notification
            requestStatus={createDocument?.status}
            message={message}
          />
        )}
      </>
    )
  );
}
