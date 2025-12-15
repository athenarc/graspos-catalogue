import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  DialogContent,
  Stack,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Notification from "@helpers/Notification.jsx";
import { useCreateDataset } from "@queries/dataset.js";
import { useCreateTool } from "@queries/tool.js";
import { useCreateDocument } from "@queries/document.js";
import { useAuth } from "../AuthContext.jsx";
import { useZenodo } from "@queries/zenodo.js";
import { useCreateService } from "@queries/service.js";
import { useOpenaire } from "@queries/openaire.js";
import ResourceFormSearch from "./ResourceFormSearch.jsx";
import WizardForm from "./ResourceWizard.jsx";
import AlertMessage from "@helpers/AlertMessage.jsx";

const resourceTypesList = [
  { value: "dataset", label: "Dataset" },
  { value: "tool", label: "Tool" },
  { value: "document", label: "Templates & Guidelines" },
  { value: "service", label: "Service" },
];

export default function ResourceForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState(
    <div style={{ lineHeight: 1.6 }}>
      <p style={{ marginBottom: 8, marginTop: 0 }}>
        Please provide the direct link to your resource hosted on <b>Zenodo</b>{" "}
        or the <b>OpenAIRE Catalogue</b>. Only URLs from these platforms are
        currently accepted.
      </p>
    </div>
  );
  const [status, setStatus] = useState("info");
  const [data, setData] = useState(null);
  const [resourceType, setResourceType] = useState({
    value: "dataset",
    label: "Dataset",
  });
  const [canCreate, setCanCreate] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

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

  const createDataset = useCreateDataset();
  const createTool = useCreateTool();
  const createDocument = useCreateDocument();
  const createService = useCreateService();

  const zenodo = useZenodo();
  const openaire = useOpenaire();

  const stepFields = {
    0: [resourceType?.value === "service" ? "url" : "doi", "resource_url_name"], // basic info
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
    if (data && data?.source) {
      setValue("source", data?.source);
    } else {
      setValue("source", "");
    }
  }, [data]);

  const getMutation = () => {
    if (resourceType?.value === "tool") return createTool;
    if (resourceType?.value === "document") return createDocument;
    if (resourceType?.value === "service") return createService;
    return createDataset;
  };

  const onSubmit = (data) => {
    const mutation = getMutation();
    if (data?.trl === "" || Array.isArray(data?.trl)) {
      data.trl = null;
    }
    mutation.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage(`${resourceType?.label} has been added successfully!`);
          navigate("..");
        },
        onError: (error) => {
          setStatus("error");
          setMessage(error?.response?.data?.detail || "Error occurred");
          form?.setError("resource_url_name", {
            message: error?.response?.data?.detail || "Error occurred",
          });
          setError("source", {
            message: error?.response?.data?.detail || "Error occurred",
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
          setError("source", null);

          if (data?.data?.mapped_resource_type) {
            setResourceType(data?.data?.mapped_resource_type);
          }

          setMessage("Zenodo record found. Loading...");
          setStatus("success");
          setData(data?.data);
          setValue("source", data?.data?.source);
          setShowWizard(false);

          setTimeout(() => {
            setShowWizard(true);
            setStatus("info");
            setMessage("");
          }, 2000);
        },
        onError: (error) => {
          if (error?.response?.status === 422) {
            const errors = error?.response?.data?.detail;

            if (Array.isArray(errors) && errors.length > 0) {
              const items = errors.map((e, idx) => {
                const field = e.loc?.slice(-1)[0] || "unknown";
                let description = "";

                switch (e.type) {
                  case "missing":
                    description = `Missing required field`;
                    break;
                  case "value_error":
                    description = `Invalid value (${e.ctx?.error || e.msg})`;
                    break;
                  default:
                    description = e.msg;
                }

                return (
                  <li key={idx}>
                    <strong>{field}</strong>: {description}
                  </li>
                );
              });

              setStatus("error");
              setMessage(
                <div style={{ lineHeight: 1.6 }}>
                  <p style={{ marginBottom: 8, marginTop: 0 }}>
                    There were errors with the Zenodo record. Please update them
                    in{" "}
                    <a
                      href={sourceValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1976d2",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Zenodo
                    </a>
                    :
                  </p>
                  <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                    {items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            } else {
              setStatus("error");
              setMessage("Zenodo record validation failed.");
            }
          } else {
            const detail =
              error?.response?.data?.detail || "Zenodo search failed";
            setStatus("error");
            setMessage(detail);
          }

          setData(null);
          setShowWizard(false);
        },
      }
    );
  };

  const onOpenaireSearch = () => {
    const sourceValue = watch("source");
    setResourceType("service");
    if (!sourceValue) {
      setError("source", { message: "Source cannot be empty" });
      return;
    }
    openaire.mutate(
      { data: { source: sourceValue } },
      {
        onSuccess: (data) => {
          setResourceType(data?.data?.mapped_resource_type);
          setError("source", null);
          setStatus("success");
          setMessage("OpenAIRE record found. Loading...");
          setData(data?.data);
          setValue("source", data?.data?.source);
          setShowWizard(false);
          setTimeout(() => {
            setShowWizard(true);
            setStatus("info");
            setMessage("");
          }, 2000);
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail || "Openaire search failed");
          setError("source", {
            message: error?.response?.data?.detail || "Openaire search failed",
          });
          setStatus("error");
          setData(null);
          setZenodoData(null);
          setShowWizard(false);
        },
      }
    );
  };

  const handleReset = () => {
    reset();
    setData(null);
    setMessage("");
    setStatus("");
    setShowWizard(false);
  };

  function handleClose(event, reason) {
    if (reason && reason === "backdropClick") return;
    navigate("..");
  }

  const mutation = getMutation();

  return (
    user && (
      <Dialog
        component="form"
        onClose={handleClose}
        open={true}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        fullWidth
        maxWidth={showWizard ? "lg" : "sm"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
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
          <Stack spacing={2}>
            <ResourceFormSearch
              form={form}
              onZenodoSearch={onZenodoSearch}
              onOpenaireSearch={onOpenaireSearch}
              handleReset={handleReset}
              isLoading={zenodo.isPending || openaire.isPending}
              isSuccess={zenodo.isSuccess || openaire.isSuccess}
              data={data}
              resourceType={resourceType}
              setStatus={setStatus}
              setMessage={setMessage}
            />

            {showWizard && data && (
              <WizardForm
                form={form}
                stepFields={stepFields}
                resourceType={resourceType?.value}
                resourceTypesList={resourceTypesList}
                setResourceType={setResourceType}
                data={data}
                resourceSource={
                  zenodo.isSuccess
                    ? "zenodo"
                    : openaire.isSuccess
                    ? "openaire"
                    : "unknown"
                }
              />
            )}
            {message && (
              <AlertMessage severity={status} sx={{ position: "relative" }}>
                {message}
              </AlertMessage>
            )}
          </Stack>
        </DialogContent>
        {data && showWizard && (
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Tooltip title="You need to fill in all required fields to create the resource">
              <span>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!data || !canCreate}
                  loading={mutation?.isPending}
                  loadingPosition="end"
                  endIcon={<AddIcon />}
                  sx={{ backgroundColor: "#20477B" }}
                >
                  {mutation?.isPending ? "Adding..." : "Add"}
                </Button>
              </span>
            </Tooltip>
          </DialogActions>
        )}
        {(mutation?.isSuccess || mutation?.isError) && (
          <Notification requestStatus={mutation?.status} message={message} />
        )}
      </Dialog>
    )
  );
}
