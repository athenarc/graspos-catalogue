import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Tabs,
  Tab,
  Stack,
  TextField,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "@helpers/Notification";
import { useForm } from "react-hook-form";
import DatasetFormFields from "@fields/Datasets/DatasetFormFields";
import DocumentFormFields from "@fields/Documents/DocumentsFormFields";
import ToolFormFields from "@fields/Tools/ToolFormFields";
import ServiceFormFields from "@fields/Services/ServiceFormFields";
import GovernanceFormFields from "@fields/GovernanceFormFields";
import CoverageFormFields from "@fields/CoverageFormFields";
import EthicsFormFields from "@fields/EthicsFormFields";
import SupportFormFields from "@fields/SupportFormFields";
import SearchedResourceFormFields from "./SearchedResourceFormFields";
import { useAuth } from "../AuthContext";

const tabs = [
  "Basic Information",
  "Governance, Sustainability & Funding",
  "Support",
  "Coverage",
  "Equity & Ethical Considerations",
];

export default function EditResourceDialog({
  resource,
  open,
  onClose,
  mutation,
  onSave,
}) {
  const { user } = useAuth();
  const { isSuccess, isError, error, reset, isPending } = mutation;
  const form = useForm({
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const assessments = watch("assessments") ?? [];
  const [tabIndex, setTabIndex] = useState(0);

  let message = "";
  if (isSuccess) message = "Resource updated successfully!";
  if (isError) message = error?.message || "Failed to update resource.";

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleAssessment = (id) => {
    setValue(
      "assessments",
      assessments.includes(id)
        ? assessments.filter((a) => a !== id)
        : [...assessments, id]
    );
  };

  const handleFormSubmit = (data) => {
    const geoIds = (data.geographical_coverage || []).map((geo) => geo._id);
    const trl = data?.trl == "" ? null : data?.trl;

    onSave({ ...data, geographical_coverage: geoIds, trl: trl });
  };
  const resourceSource = resource?.zenodo
    ? "zenodo"
    : resource?.openaire
    ? "openaire"
    : "unknown";
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{ bgcolor: "#20477B", color: "white", textAlign: "center" }}
        >
          Edit Resource
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            {tabs.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>

          {tabIndex === 0 && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  {...form?.register("resource_url_name", {
                    value: resource?.resource_url_name,
                    required: "Please a name identifier for the resource.",
                    // Use only letters, numbers, hyphens and dashes (no spaces)
                    pattern: {
                      value: /^[a-zA-Z0-9-_]+$/,
                      message:
                        "Only letters, numbers, hyphens and dashes are allowed (no spaces).",
                    },
                    // Minimum length of 3 characters
                    minLength: {
                      value: 3,
                      message:
                        "The unique name identifier must be at least 3 characters long.",
                    },
                    // Maximum length of 100 characters
                    maxLength: {
                      value: 100,
                      message:
                        "The unique name identifier cannot exceed 100 characters.",
                    },
                  })}
                  label="Resource URL Name"
                  // disable input if resource_url_name exists.
                  // If user is super_user, allow editing.
                  // If not super_user and resource_url_name exists, disable input.
                  disabled={
                    user?.super_user ? false : !!resource?.resource_url_name
                  }
                  defaultValue={resource?.resource_url_name || ""}
                  placeholder="Unique name identifier for the resource"
                  error={!!form?.formState?.errors?.resource_url_name}
                  helperText={
                    form?.formState?.errors?.resource_url_name?.message ?? ""
                  }
                  fullWidth
                />
              </Stack>
              {resource?.resource_type === "dataset" && (
                <DatasetFormFields form={form} resource={resource} />
              )}
              {resource?.resource_type === "document" && (
                <DocumentFormFields form={form} resource={resource} />
              )}
              {resource?.resource_type === "tool" && (
                <ToolFormFields form={form} resource={resource} />
              )}
              {resource?.resource_type === "service" && (
                <ServiceFormFields form={form} resource={resource} />
              )}
              <SearchedResourceFormFields
                resourceSource={resourceSource}
                form={form}
                searchedResource={resource?.zenodo || resource?.openaire}
                resourceType={resource?.resource_type}
              />
            </Stack>
          )}

          {tabIndex === 1 && (
            <GovernanceFormFields form={form} resource={resource} />
          )}
          {tabIndex === 2 && (
            <SupportFormFields form={form} resource={resource} />
          )}
          {tabIndex === 3 && (
            <CoverageFormFields form={form} resource={resource} />
          )}
          {tabIndex === 4 && (
            <EthicsFormFields form={form} resource={resource} />
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button onClick={onClose} variant="outlined" disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleFormSubmit({
                ...getValues(),
              })
            }
            variant="contained"
            endIcon={<SaveIcon />}
            sx={{ backgroundColor: "#20477B" }}
            disabled={isPending || !form?.formState?.isValid}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {(isSuccess || isError) && (
        <Notification
          requestStatus={isSuccess ? "success" : "error"}
          message={message}
        />
      )}
    </>
  );
}
