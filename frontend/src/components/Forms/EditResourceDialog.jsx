import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  FormGroup,
  Card,
  CardContent,
  Checkbox,
  Box,
  Tooltip,
  FormControlLabel,
  Autocomplete,
  TextField,
  Grid2 as Grid,
  Button,
  Tabs,
  Tab,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "@helpers/Notification";
import { useForm, Controller } from "react-hook-form";
import DatasetFormFields from "./DatasetFormFields";
import DocumentFormFields from "./DocumentsFormFields";
import ToolFormFields from "./ToolFormFields";
import ServiceFormFields from "./ServiceFormFields";
import GovernanceFormFields from "./GovernanceFormFields";
import CoverageFormFields from "./CoverageFormFields";
import EthicsFormFields from "./EthicsFormFields";
import SupportFormFields from "./SupportFormFields";

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
  const { isSuccess, isError, error, reset, isPending } = mutation;
  const form = useForm({
    mode: "onChange",
    defaultValues: { ...resource, trl: resource?.trl || [] },
  });

  const {
    handleSubmit,
    setError,
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
    onSave({ ...data, geographical_coverage: geoIds });
  };

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
            <>
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
            </>
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
            disabled={isPending}
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
