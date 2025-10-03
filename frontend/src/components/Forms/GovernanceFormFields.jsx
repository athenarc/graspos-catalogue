import { Stack, TextField } from "@mui/material";
import AccordionField from "../Helpers/AccordionField";

function GovernanceModel({ form }) {
  return (
    <TextField
      label="Governance Model"
      {...form.register("governance_model")}
      fullWidth
      margin="normal"
    />
  );
}

function GovernanceBodies({ form }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Governance Bodies"
      name="governance_bodies"
      label="Governance Bodies"
      placeholder="Enter governance bodies"
    />
  );
}

function SustainabilityPlan({ form }) {
  return (
    <TextField
      label="Sustainability Plan"
      {...form.register("sustainability_plan")}
      fullWidth
      margin="normal"
    />
  );
}

export default function GovernanceFormFields({ form }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <GovernanceModel form={form} />
      <GovernanceBodies form={form} />
      <SustainabilityPlan form={form} />
    </Stack>
  );
}
