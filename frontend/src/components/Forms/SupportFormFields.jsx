import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrayInputField from "@helpers/ArrayInputField";
import AccordionField from "../Helpers/AccordionField";

function SupportChannels({ form }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Support Channels"
      name="support_channels"
      label="Support Channels"
      placeholder="Enter a URL or email"
    />
  );
}

function DocumentationURLs({ form }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Documentation URLs"
      name="documentation_urls"
      label="Documentation URLs"
      placeholder="Enter documentation URLs"
    />
  );
}

function TrainingMaterials({ form }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Training Materials"
      name="training_materials"
      label="Training Materials"
      placeholder="Enter training material URLs"
    />
  );
}

export default function SupportFormFields({ form }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <SupportChannels form={form} />
      <DocumentationURLs form={form} />
      <TrainingMaterials form={form} />
    </Stack>
  );
}
