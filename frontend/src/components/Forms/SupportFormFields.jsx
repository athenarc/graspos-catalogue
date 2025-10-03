import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrayInputField from "@helpers/ArrayInputField";

export default function SupportFormFields({ control, errors, trigger, watch }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Support Channels</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ArrayInputField
            control={control}
            name="support_channels"
            label="Support Channels"
            errors={errors}
            placeholder="Enter a URL or email"
            trigger={trigger}
            watch={watch}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Documentation URLs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ArrayInputField
            control={control}
            name="documentation_urls"
            label="Documentation URLs"
            errors={errors}
            placeholder="Enter documentation URLs"
            trigger={trigger}
            watch={watch}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Training Materials</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ArrayInputField
            control={control}
            name="training_materials"
            label="Training Materials"
            errors={errors}
            placeholder="Enter training material URLs"
            trigger={trigger}
            watch={watch}
          />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
