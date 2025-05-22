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
  useMediaQuery,
  useTheme,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    setValue("source", zenodoData?.source || "");
  }, [zenodoData, setValue]);

  const getMutation = () =>
    resourceType === "tool"
      ? createTool
      : resourceType === "document"
      ? createDocument
      : createDataset;

  const onSubmit = (data) => {
    const mutation = getMutation();
    mutation.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage(`${resourceType} created successfully!`);
          navigate("..");
        },
        onError: (error) => {
          reset();
          const detail = error?.response?.detail || "Error occurred";
          setMessage(detail);
          setError("source", { message: detail });
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
        onSuccess: ({ data }) => {
          setZenodoData(data);
          setMessage("Zenodo data fetched!");
          setValue("source", data.source);
        },
        onError: (error) => {
          const detail =
            error?.response?.data?.detail || "Zenodo search failed";
          setMessage(detail);
          setError("source", { message: detail });
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

  const handleClose = () => navigate("..");

  const mutation = getMutation();

  return (
    user && (
      <>
        <Dialog
          component="form"
          onClose={handleClose}
          open
          noValidate
          fullWidth
          fullScreen={isMobile}
          maxWidth={isMobile ? undefined : zenodoData ? "lg" : "sm"}
          onSubmit={handleSubmit(onSubmit)}
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
          <DialogContent sx={{ p: isMobile ? 2 : 4 }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={isMobile ? 2 : 4}
            >
              <Stack spacing={2} sx={{ flex: 1 }}>
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
                  {!isMobile && <Divider orientation="vertical" flexItem />}

                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <Typography variant="h6">Resource Details</Typography>

                    <FormControl fullWidth>
                      <InputLabel>Resource Type</InputLabel>
                      <Select
                        disabled={!zenodoData}
                        value={resourceType}
                        label="Resource Type"
                        onChange={(e) => setResourceType(e.target.value)}
                      >
                        <MenuItem value="dataset">Dataset</MenuItem>
                        <MenuItem value="tool">Tool</MenuItem>
                        <MenuItem value="document">Document</MenuItem>
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
                loading={mutation.isPending}
                loadingPosition="end"
                endIcon={<AddIcon />}
                sx={{ backgroundColor: "#20477B" }}
              >
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogActions>
          )}
        </Dialog>

        {mutation.status !== "success" && (
          <Notification requestStatus={mutation.status} message={message} />
        )}
      </>
    )
  );
}
