import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  DialogContent,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Notification from "@helpers/Notification.jsx";
import { useCreateDataset } from "@queries/dataset.js";
import { useCreateTool } from "@queries/tool.js";
import { useCreateDocument } from "@/queries/document.js";
import ResourcePreview from "./ResourcePreview.jsx";
import { useAuth } from "../AuthContext.jsx";
import { useZenodo } from "@queries/zenodo.js";
import { useCreateService } from "@queries/service.js";
import { useOpenaire } from "@queries/openaire.js";
import ResourceFormSearch from "./ResourceFormSearch.jsx";
import MessageBox from "@helpers/ErrorMessage.jsx";
import WizardForm from "./ResourceWizard.jsx";

export default function ResourceForm() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);
  const [resourceType, setResourceType] = useState("dataset");
  const [fieldMissing, setFieldMissing] = useState(false);
  const [resourceTypesList, setResourceTypesList] = useState([
    { value: "dataset", label: "Dataset" },
    { value: "tool", label: "Tool" },
    { value: "document", label: "Templates & Guidelines" },
    { value: "service", label: "Service" },
  ]);
  const [canCreate, setCanCreate] = useState(false);

  const { user } = useAuth();
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      evidence_types: [],
      covered_research_products: [],
      covered_fields: [],
      geographical_coverage: [],
      assessment_functionalities: [],
    },
  });

  const {
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const navigate = useNavigate();

  const createDataset = useCreateDataset();
  const createTool = useCreateTool();
  const createDocument = useCreateDocument();
  const createService = useCreateService();

  const zenodo = useZenodo();
  const openaire = useOpenaire();

  const stepFields = {
    0: ["doi"], // basic info
    1: [], // governance step
    2: [], // support step
    3: ["geographical_coverage", "covered_fields", "covered_research_products"], // coverage step
    4: [], // ethics step
  };
  const allRequiredFields = Object.values(stepFields).flat();

  const watchedValues = watch(allRequiredFields);

  useEffect(() => {
    // This useEffect checks if all required fields are filled to enable the Create button independently of every step in the wizard
    const isComplete = allRequiredFields.every((field) => {
      const value = getValues(field);
      if (Array.isArray(value))
        return (
          value?.length > 0 &&
          value.every((v) => v != null && v !== "" && v !== " ")
        );
      return value != null && value !== "" && value !== " ";
    });
    setCanCreate(isComplete);
  }, [JSON.stringify(watchedValues)]);

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
      { value: "document", label: "Templates & Guidelines" },
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
          // setMessage("Zenodo data fetched!");
          setValue("source", data?.data?.source);
        },
        onError: (error) => {
          if (error?.response?.status === 422) {
            setFieldMissing(true);

            const errors = error?.response?.data?.detail;
            // Αν είναι array, κάνε format
            let msg = "Required fields: ";
            if (Array.isArray(errors)) {
              msg += errors.map((e) => e.loc?.slice(-1)[0]).join(", ");
            }
            msg += " are missing in the Zenodo record.";

            setMessage(
              <>
                {msg} Please enter them in{" "}
                <a href={sourceValue} target="_blank" rel="noopener noreferrer">
                  Zenodo
                </a>
                .
              </>
            );
          } else {
            const detail =
              error?.response?.data?.detail || "Zenodo search failed";
            setMessage(detail);
            setFieldMissing(true);
          }
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
    setFieldMissing(false);
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
                  register={form?.register}
                  errors={form?.errors}
                  getValues={form?.getValues}
                  onZenodoSearch={onZenodoSearch}
                  onOpenaireSearch={onOpenaireSearch}
                  handleReset={handleReset}
                  isLoading={zenodo.isPending || openaire.isPending}
                />
                <ResourcePreview data={data} />
              </Stack>
              <Divider orientation="vertical" flexItem />
              {data && (
                <WizardForm
                  form={form}
                  stepFields={stepFields}
                  resourceType={resourceType}
                  resourceTypesList={resourceTypesList}
                  setResourceType={setResourceType}
                  data={data}
                />
              )}
            </Stack>
            {fieldMissing && <MessageBox message={message} status="error" />}
          </DialogContent>
          {data && (
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!data || !canCreate}
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
