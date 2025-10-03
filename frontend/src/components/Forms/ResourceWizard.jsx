import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

import DatasetFormFields from "./DatasetFormFields";
import DocumentFormFields from "./DocumentsFormFields";
import ToolFormFields from "./ToolFormFields";
import ServiceFormFields from "./ServiceFormFields";
import GovernanceFormFields from "./GovernanceFormFields";
import SupportFormFields from "./SupportFormFields";
import CoverageFormFields from "./CoverageFormFields";
import EthicsFormFields from "./EthicsFormFields";

const steps = [
  "Basic Information",
  "Governance, Sustainability & Funding",
  "Support",
  "Coverage",
  "Equity & Ethical Considerations",
];

export default function WizardForm({
  form,
  stepFields,
  resourceType,
  resourceTypesList,
  setResourceType,
  data,
}) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    const fieldsToValidate = stepFields[activeStep] || [];
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) return;
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <FormProvider {...form}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Resource type</InputLabel>
              <Select
                disabled={!data}
                value={resourceType}
                labelId="resource-type-select-label"
                label="Resource type"
                onChange={(e) => setResourceType(e.target.value)}
              >
                {resourceTypesList.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {resourceType === "dataset" && (
              <DatasetFormFields form={form} errors={form?.formState?.errors} />
            )}
            {resourceType === "document" && <DocumentFormFields form={form} />}
            {resourceType === "tool" && <ToolFormFields form={form} />}
            {resourceType === "service" && <ServiceFormFields form={form} />}
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2}>
            <GovernanceFormFields form={form} />
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2}>
            <SupportFormFields form={form} />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack spacing={2}>
            <CoverageFormFields form={form} resourceType={resourceType} />
          </Stack>
        )}

        {activeStep === 4 && (
          <Stack spacing={2}>
            <EthicsFormFields
              form={form}
              control={form.control}
              register={form.register}
              errors={form.formState.errors}
            />
          </Stack>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </Box>
      </FormProvider>
    </Stack>
  );
}
