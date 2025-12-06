import { Stack, TextField } from "@mui/material";
import AccordionField from "@helpers/AccordionField";

function GovernanceModel({ form, resource = null }) {
  return (
    <TextField
      label="Governance Model"
      {...form.register("governance_model")}
      fullWidth
      defaultValue={resource?.governance_model || ""}
    />
  );
}

function GovernanceBodies({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Governance Bodies"
      name="governance_bodies"
      label="Governance Bodies"
      placeholder="Enter governance bodies"
      defaultValue={resource?.governance_bodies || []}
    />
  );
}

function SustainabilityPlan({ form, resource = null }) {
  return (
    <TextField
      label="Sustainability Plan"
      {...form.register("sustainability_plan")}
      fullWidth
      margin="normal"
      defaultValue={resource?.sustainability_plan || ""}
    />
  );
}

export default function GovernanceFormFields({ form, resource = null }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <GovernanceModel form={form} resource={resource} />
      <GovernanceBodies form={form} resource={resource} />
      <SustainabilityPlan form={form} resource={resource} />
    </Stack>
  );
}
