import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  DialogContent,
  TextField,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Notification from "../Notification.jsx";
import { useCreateDataset } from "../../queries/dataset.js";
import { useCreateTool } from "../../queries/tool.js";
import { useCreateDocument } from "../../queries/document.js";
import ZenodoForm from "../Forms/ZenodoForm.jsx";
import { useAuth } from "../AuthContext.jsx";
import DatasetFormFields from "./DatasetFormFields.jsx";
import DocumentFormFields from "./DocumentsFormFields.jsx";
import ToolFormFields from "./ToolFormFields.jsx";

export default function ResourceForm() {
  const [message, setMessage] = useState("");
  const [zenodoData, setZenodoData] = useState();
  const [resourceType, setResourceType] = useState("dataset");
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();

  const createDataset = useCreateDataset();
  const createTool = useCreateTool();
  const createDocument = useCreateDocument();

  useEffect(() => {
    setValue("source", zenodoData?.source);
  }, [zenodoData]);

  const getMutation = () => {
    if (resourceType === "tool") return createTool;
    if (resourceType === "document") return createDocument;
    return createDataset;
  };

  const onSubmit = (data) => {
    const mutation = getMutation();
    mutation.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage(`${resourceType} has been created successfully!`);
          navigate("..");
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

  const mutation = getMutation();

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
            Add Resource
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Resource Type</InputLabel>
              <Select
                value={resourceType}
                label="Resource Type"
                onChange={(e) => setResourceType(e.target.value)}
              >
                <MenuItem value="dataset">Dataset</MenuItem>
                <MenuItem value="tool">Tool</MenuItem>
                <MenuItem value="document">Document</MenuItem>
              </Select>
            </FormControl>

            <ZenodoForm
              zenodoData={zenodoData}
              setZenodoData={setZenodoData}
              setMessage={setMessage}
            />

            {zenodoData && (
              <>
                {resourceType === "dataset" && (
                  <DatasetFormFields register={register} errors={errors} />
                )}
                {resourceType === "document" && (
                  <DocumentFormFields register={register} errors={errors} />
                )}
                {resourceType === "tool" && (
                  <ToolFormFields register={register} errors={errors} />
                )}
              </>
            )}
          </DialogContent>
          {zenodoData && (
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!zenodoData}
                loading={mutation?.isPending}
                loadingPosition="end"
                endIcon={<AddIcon />}
                sx={{ backgroundColor: "#20477B" }}
              >
                {mutation?.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogActions>
          )}
        </Dialog>
        {(!mutation?.isSuccess || mutation?.isError) && (
          <Notification requestStatus={mutation?.status} message={message} />
        )}
      </>
    )
  );
}
