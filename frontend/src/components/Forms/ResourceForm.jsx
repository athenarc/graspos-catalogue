import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  DialogContent,
  Stack,
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
import { useAuth } from "../AuthContext.jsx";
import { useZenodo } from "@queries/zenodo.js";
import { useCreateService } from "@queries/service.js";
import { useOpenaire } from "@queries/openaire.js";
import ResourceFormSearch from "./ResourceFormSearch.jsx";
import WizardForm from "./ResourceWizard.jsx";
import AlertMessage from "../Helpers/AlertMessage.jsx";

const resourceTypesList = [
  { match: ["dataset"], value: "dataset", label: "Dataset" },
  { match: ["tool"], value: "tool", label: "Tool" },
  { match: ["software"], value: "tool", label: "Tool" },
  {
    match: ["document"],
    value: "document",
    label: "Templates & Guidelines",
  },
  {
    match: ["publication"],
    value: "document",
    label: "Templates & Guidelines",
  },
  { match: ["service"], value: "service", label: "Service" },
];

export default function ResourceForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("info");
  const [data, setData] = useState(null);
  const [resourceType, setResourceType] = useState("dataset");
  const [canCreate, setCanCreate] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [delayActive, setDelayActive] = useState(false);

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
    0: [resourceType === "service" ? "url" : "doi"], // basic info
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
    if (data?.trl === "") {
      data.trl = null;
    }
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

    if (!sourceValue) {
      setError("source", { message: "Source cannot be empty" });
      return;
    }

    zenodo.mutate(
      { data: { source: sourceValue } },
      {
        onSuccess: (data) => {
          setError("source", null);

          const recordType =
            data?.data?.metadata?.resource_type?.type?.toLowerCase();

          if (recordType) {
            const matchedType = resourceTypesList?.find((item) =>
              item?.match?.some((m) => recordType?.includes(m?.toLowerCase()))
            );

            if (matchedType) {
              setResourceType(matchedType?.value);
            }
          }
          setMessage("Zenodo record found. Loading...");
          setStatus("success");
          setData(data?.data);
          setValue("source", data?.data?.source);
          setShowWizard(false);
          setDelayActive(true);

          setTimeout(() => {
            setShowWizard(true);
            setDelayActive(false);
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
                <>
                  <p>
                    There were errors with the Zenodo record. Please update them
                    in{" "}
                    <a
                      href={sourceValue}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Zenodo
                    </a>
                    :
                  </p>
                  <ul>{items}</ul>
                </>
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
          setError("source", null);
          setStatus("success");
          setMessage("OpenAIRE record found. Loading...");
          setData(data?.data);
          setValue("source", data?.data?.source);
          setShowWizard(false);
          setDelayActive(true);
          setTimeout(() => {
            setShowWizard(true);
            setDelayActive(false);
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
                  resourceType={resourceType}
                  resourceTypesList={resourceTypesList}
                  setResourceType={setResourceType}
                  data={data}
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
