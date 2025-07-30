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
  FormControlLabel,
  FormGroup,
  Checkbox,
  Tooltip,
  TextField,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

import Notification from "../Notification.jsx";
import { useCreateDataset } from "../../queries/dataset.js";
import { useCreateTool } from "../../queries/tool.js";
import { useCreateDocument } from "../../queries/document.js";
import ResourcePreview from "./ResourcePreview.jsx";
import { useAuth } from "../AuthContext.jsx";
import DatasetFormFields from "./DatasetFormFields.jsx";
import DocumentFormFields from "./DocumentsFormFields.jsx";
import ToolFormFields from "./ToolFormFields.jsx";
import { useZenodo } from "../../queries/zenodo.js";
import { useScopes } from "../../queries/scope.js";
import { useCountries } from "../../queries/countries.js";
import { useAssessments } from "../../queries/assessment.js";
import ServiceFormFields from "./ServiceFormFields.jsx";
import { useCreateService } from "../../queries/service.js";
import ResourcePathsForm from "./ResourcePathsForm.jsx";
import { useOpenaire } from "../../queries/openaire.js";
import ResourceFormSearch from "./ResourceFormSearch.jsx";

export default function ResourceForm() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);
  const [resourceType, setResourceType] = useState("dataset");
  const [resourceTypesList, setResourceTypesList] = useState([
    { value: "dataset", label: "Dataset" },
    { value: "tool", label: "Tool" },
    { value: "document", label: "Document" },
    { value: "service", label: "Service" },
  ]);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();

  const createDataset = useCreateDataset();
  const createTool = useCreateTool();
  const createDocument = useCreateDocument();
  const createService = useCreateService();

  const zenodo = useZenodo();
  const openaire = useOpenaire();

  useEffect(() => {
    if (data && data.source) {
      setValue("source", data.source);
    } else {
      setValue("source", "");
    }
  }, [data]);

  const getMutation = () => {
    if (resourceType === "tool") return createTool;
    if (resourceType === "document") return createDocument;
    if (resourceType === "service") return createService;
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

    setResourceType("dataset");
    setResourceTypesList([
      { value: "dataset", label: "Dataset" },
      { value: "tool", label: "Tool" },
      { value: "document", label: "Document" },
    ]);
    if (!sourceValue) {
      setError("source", { message: "Source cannot be empty" });
      return;
    }

    zenodo.mutate(
      { data: { source: sourceValue } },
      {
        onSuccess: (data) => {
          setData(data?.data);
          // Set resource type based on Zenodo data if the data.data.resource_type exists in available resourceTypesList
          if (
            data?.data?.resource_type &&
            resourceTypesList.some(
              (type) => type.value === data?.data?.resource_type
            )
          ) {
            setResourceType(data?.data?.resource_type);
          }
          setMessage("Zenodo data fetched!");
          setValue("source", data?.data?.source);
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail || "Zenodo search failed");
          setError("source", {
            message: error?.response?.data?.detail || "Zenodo search failed",
          });
          setData(null);
        },
      }
    );
  };
  const onOpenaireSearch = () => {
    const sourceValue = watch("source");
    setResourceType("service");
    setResourceTypesList([{ value: "service", label: "Service" }]);
    if (!sourceValue) {
      setError("source", { message: "Source cannot be empty" });
      return;
    }
    openaire.mutate(
      { data: { source: sourceValue } },
      {
        onSuccess: (data) => {
          setData(data?.data);
          setMessage("Openaire data fetched!");
          setValue("source", data?.data?.source);
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail || "Openaire search failed");
          setError("source", {
            message: error?.response?.data?.detail || "Openaire search failed",
          });
          setData(null);
          setZenodoData(null);
        },
      }
    );
  };

  const handleReset = () => {
    reset();
    setData(null);
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
          maxWidth={data ? "lg" : "sm"}
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
                <ResourceFormSearch
                  register={register}
                  errors={errors}
                  getValues={getValues}
                  onZenodoSearch={onZenodoSearch}
                  onOpenaireSearch={onOpenaireSearch}
                  handleReset={handleReset}
                  isLoading={zenodo.isPending || openaire.isPending}
                />
                <ResourcePreview data={data} />
              </Stack>

              {data && (
                <ResourcePathsForm
                  data={data}
                  control={control}
                  setValue={setValue}
                  resourceType={resourceType}
                  resourceTypesList={resourceTypesList}
                  setResourceType={setResourceType}
                  register={register}
                  errors={errors}
                />
              )}
            </Stack>
          </DialogContent>
          {data && (
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!data}
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
        {(mutation?.isSuccess || mutation?.isError) && (
          <Notification requestStatus={mutation?.status} message={message} />
        )}
      </>
    )
  );
}
