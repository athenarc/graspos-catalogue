import { TextField, Stack } from "@mui/material";
import AccordionField from "../Helpers/AccordionField";

function PrivacyPolicy({ form, resource = null }) {
  return (
    <TextField
      label="Privacy Policy"
      {...form?.register("privacy_policy")}
      fullWidth
      margin="normal"
      defaultValue={resource?.privacy_policy || ""}
    />
  );
}

function Limitations({ form, resource = null }) {
  return (
    <TextField
      label="Limitations"
      {...form?.register("limitations")}
      fullWidth
      margin="normal"
      defaultValue={resource?.limitations || ""}
    />
  );
}

function EthicalConsiderations({ form, resource = null }) {
  return (
    <TextField
      label="Ethical Considerations"
      {...form?.register("ethical_considerations")}
      fullWidth
      margin="normal"
      defaultValue={resource?.ethical_considerations || ""}
    />
  );
}

function EthicsCommittee({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      name="ethics_committee"
      label="Ethics Committee"
      fieldTitle="Ethics Committee"
      placeholder="Enter ethics committee details"
      defaultValue={resource?.ethics_committee || []}
    />
  );
}
export default function EthicsFormFields({ form, resource = null }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <PrivacyPolicy form={form} resource={resource} />
      <Limitations form={form} resource={resource} />
      <EthicalConsiderations form={form} resource={resource} />
      <EthicsCommittee form={form} resource={resource} />
    </Stack>
  );
}
