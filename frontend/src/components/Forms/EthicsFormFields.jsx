import { TextField, Stack } from "@mui/material";
import AccordionField from "../Helpers/AccordionField";

function PrivacyPolicy({ form }) {
  return (
    <TextField
      label="Privacy Policy"
      {...form?.register("privacy_policy")}
      fullWidth
      margin="normal"
    />
  );
}

function Limitations({ form }) {
  return (
    <TextField
      label="Limitations"
      {...form?.register("limitations")}
      fullWidth
      margin="normal"
    />
  );
}

function EthicalConsiderations({ form }) {
  return (
    <TextField
      label="Ethical Considerations"
      {...form?.register("ethical_considerations")}
      fullWidth
      margin="normal"
    />
  );
}

function EthicsCommittee({ form }) {
  return (
    <AccordionField
      form={form}
      name="ethics_committee"
      label="Ethics Committee"
      fieldTitle="Ethics Committee"
      placeholder="Enter ethics committee details"
    />
  );
}
export default function EthicsFormFields({ form }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <PrivacyPolicy form={form} />
      <Limitations form={form} />
      <EthicalConsiderations form={form} />
      <EthicsCommittee form={form} />
    </Stack>
  );
}
