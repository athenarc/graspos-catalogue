import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrayInputField from "../Helpers/ArrayInputField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function GovernanceModel({ register, errors }) {
  return (
    <TextField
      label="Governance Model"
      {...register("governance_model")}
      fullWidth
      margin="normal"
    />
  );
}

function GovernanceBodies({ control, register, errors, trigger, watch }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Governance Bodies</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ArrayInputField
          control={control}
          name="governance_bodies"
          label="Governance Bodies"
          errors={errors}
          placeholder="Enter governance bodies"
          trigger={trigger}
          watch={watch}
        />
      </AccordionDetails>
    </Accordion>
  );
}

function SustainabilityPlan({ register, errors }) {
  return (
    <TextField
      label="Sustainability Plan"
      {...register("sustainability_plan")}
      fullWidth
      margin="normal"
    />
  );
}

export default function GovernanceFormFields({ control, register, errors, trigger, watch }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <GovernanceModel register={register} errors={errors} />
      <GovernanceBodies register={register} errors={errors} control={control} trigger={trigger} watch={watch} />
      <SustainabilityPlan register={register} errors={errors} />
    </Stack>
  );
}
