import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrayInputField from "../Helpers/ArrayInputField";

function PrivacyPolicy({ register, errors }) {
  return (
    <TextField
      label="Privacy Policy"
      {...register("privacy_policy")}
      fullWidth
      margin="normal"
    />
  );
}

function Limitations({ register }) {
  return (
    <TextField
      label="Limitations"
      {...register("limitations")}
      fullWidth
      margin="normal"
    />
  );
}

function EthicalConsiderations({ register }) {
  return (
    <TextField
      label="Ethical Considerations"
      {...register("ethical_considerations")}
      fullWidth
      margin="normal"
    />
  );
}

function EthicsCommittee({ control, errors, trigger, watch }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Ethics Committee</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ArrayInputField
          control={control}
          name="ethics_committee"
          label="Ethics Committee"
          errors={errors}
          placeholder="Enter a person contributing as ethics advisor on the resource"
          trigger={trigger}
          watch={watch}
        />
      </AccordionDetails>
    </Accordion>
  );
}
export default function EthicsFormFields({ control, register, errors, trigger, watch }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <PrivacyPolicy register={register} errors={errors} />
      <Limitations register={register} errors={errors} />
      <EthicalConsiderations register={register} errors={errors} />
      <EthicsCommittee register={register} errors={errors} control={control} trigger={trigger} watch={watch} />
    </Stack>
  );
}
