import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  DialogContent,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Typography,
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
import { useZenodo } from "../../queries/zenodo.js";

export default function ResourceForm() {
  const [message, setMessage] = useState("");
  const [zenodoData, setZenodoData] = useState(null);
  const [resourceType, setResourceType] = useState("dataset");
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();

  const createDataset = useCreateDataset();
  const createTool = useCreateTool();
  const createDocument = useCreateDocument();

  const zenodo = useZenodo();

  useEffect(() => {
    if (zenodoData && zenodoData.source) {
      setValue("source", zenodoData.source);
    } else {
      setValue("source", "");
    }
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
          setMessage(error?.response?.detail || "Error occurred");
          setError("source", {
            message: error?.response?.detail || "Error occurred",
          });
        },
      }
    );
  };

  const onZenodoSearch = () => {
    const sourceValue = watch("source");

    if (!sourceValue) {
      setError("source", { message: "Source cannot be empty" });
      return;
    }

    zenodo.mutate(
      { data: { source: sourceValue } },
      {
        onSuccess: (data) => {
          setZenodoData(data?.data);
          setMessage("Zenodo data fetched!");
          setValue("source", data?.data?.source);
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail || "Zenodo search failed");
          setError("source", {
            message: error?.response?.data?.detail || "Zenodo search failed",
          });
          setZenodoData(null);
        },
      }
    );
  };

  const handleReset = () => {
    reset();
    setZenodoData(null);
    setMessage("");
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
          maxWidth={zenodoData ? "lg" : "sm"}
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
          <DialogContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={4}>
              <Stack
                direction="column"
                alignContent="flex-start"
                spacing={2}
                sx={{ width: "100%" }}
              >
                <ZenodoForm
                  register={register}
                  errors={errors}
                  zenodoData={zenodoData}
                  onZenodoSearch={onZenodoSearch}
                  handleReset={handleReset}
                  isLoading={zenodo.isPending}
                />
              </Stack>
              {zenodoData && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                    <Typography variant="h6">Resource Details</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Resource type</InputLabel>
                      <Select
                        disabled={!zenodoData}
                        value={resourceType}
                        label="Resource type"
                        onChange={(e) => setResourceType(e.target.value)}
                      >
                        <MenuItem value="dataset">Dataset</MenuItem>
                        <MenuItem value="tool">Tool</MenuItem>
                        <MenuItem value="document">Template or Guideline</MenuItem>
                      </Select>
                    </FormControl>

                    {resourceType === "dataset" && (
                      <DatasetFormFields register={register} errors={errors} />
                    )}
                    {resourceType === "document" && (
                      <DocumentFormFields register={register} errors={errors} />
                    )}
                    {resourceType === "tool" && (
                      <ToolFormFields register={register} errors={errors} />
                    )}
                  </Stack>
                </>
              )}
            </Stack>
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
