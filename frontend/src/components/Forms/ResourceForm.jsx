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
import ZenodoForm from "../Forms/ZenodoForm.jsx";
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

export default function ResourceForm() {
  const [message, setMessage] = useState("");
  const [zenodoData, setZenodoData] = useState(null);
  const [resourceType, setResourceType] = useState("dataset");
  const { user } = useAuth();
  const countries = useCountries();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();

  const createDataset = useCreateDataset();
  const createTool = useCreateTool();
  const createDocument = useCreateDocument();
  const createService = useCreateService();

  const zenodo = useZenodo();
  const scopesQuery = useScopes();
  const [selectedScopes, setSelectedScopes] = useState([]);
  const assessmentData = useAssessments();
  const [selectedAssessments, setSelectedAssessments] = useState([]);

  useEffect(() => {
    setValue("scopes", selectedScopes);
  }, [selectedScopes, setValue]);

  useEffect(() => {
    setValue("assessments", selectedAssessments);
  }, [selectedAssessments, setValue]);

  const handleToggleScope = (scopeId) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleToggleAssessment = (assessmentId) => {
    setSelectedAssessments((prev) =>
      prev.includes(assessmentId)
        ? prev.filter((id) => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

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
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6" sx={{ mr: 0.5 }}>
                        Resource Scope
                      </Typography>
                      <Tooltip title="SCOPE Framework for Research Evaluation">
                        <InfoIcon fontSize="small" />
                      </Tooltip>
                    </Stack>

                    <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                      <FormGroup row>
                        {scopesQuery?.data?.data?.map((scope) => (
                          <Tooltip key={scope._id} title={scope?.description}>
                            <FormControlLabel
                              key={scope._id}
                              control={
                                <Checkbox
                                  checked={selectedScopes.includes(scope._id)}
                                  onChange={() => handleToggleScope(scope._id)}
                                  sx={{ color: scope.bg_color ?? "#1976d2" }}
                                />
                              }
                              label={scope.name}
                            />
                          </Tooltip>
                        ))}
                      </FormGroup>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6" sx={{ mr: 0.5 }}>
                        Geographical Coverage
                      </Typography>
                      <Tooltip title="Select applicable countries or regions.">
                        <InfoIcon fontSize="small" />
                      </Tooltip>
                    </Stack>
                    {/* Geographical Coverage */}
                    <Controller
                      name="geographical_coverage"
                      control={control}
                      defaultValue={[]} // Ensure it's always controlled from the start
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          options={countries?.data?.data}
                          getOptionLabel={(option) => option.label}
                          value={field.value ?? []} // Fix: always pass an array
                          onChange={(_, value) => field.onChange(value)}
                          renderOption={(props, option) => {
                            const { key, ...rest } = props; // Destructure key out
                            return (
                              <li key={key} {...rest}>
                                <img
                                  loading="lazy"
                                  width="20"
                                  src={option.flag}
                                  alt=""
                                  style={{ marginRight: 10 }}
                                />
                                {option.label} ({option.code})
                              </li>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select countries"
                              placeholder="Start typing..."
                            />
                          )}
                        />
                      )}
                    />
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6" sx={{ mr: 0.5 }}>
                        Assessment Stages
                      </Typography>
                      <Tooltip title="">
                        <InfoIcon fontSize="small" />
                      </Tooltip>
                    </Stack>
                    <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                      <FormGroup row>
                        {assessmentData?.data?.data?.map((assessment) => (
                          <Tooltip
                            key={assessment._id}
                            title={assessment?.description}
                          >
                            <FormControlLabel
                              key={assessment._id}
                              control={
                                <Checkbox
                                  checked={selectedAssessments.includes(
                                    assessment._id
                                  )}
                                  onChange={() =>
                                    handleToggleAssessment(assessment._id)
                                  }
                                />
                              }
                              label={assessment.name}
                            />
                          </Tooltip>
                        ))}
                      </FormGroup>
                    </Stack>
                    <Typography variant="h6" sx={{ mt: 3 }}>
                      Resource Details
                    </Typography>
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
                        <MenuItem value="document">
                          Template or Guideline
                        </MenuItem>
                        <MenuItem value="service">Service</MenuItem>
                      </Select>
                    </FormControl>

                    {resourceType === "dataset" && (
                      <DatasetFormFields
                        register={register}
                        errors={errors}
                        setValue={setValue}
                      />
                    )}
                    {resourceType === "document" && (
                      <DocumentFormFields register={register} errors={errors} />
                    )}
                    {resourceType === "tool" && (
                      <ToolFormFields register={register} errors={errors} />
                    )}
                    {resourceType === "service" && (
                      <ServiceFormFields register={register} errors={errors} />
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
