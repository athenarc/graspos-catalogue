import { Stack } from "@mui/material";
import AccordionField from "../Helpers/AccordionField";

function SupportChannels({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Support Channels"
      name="support_channels"
      label="Support Channels"
      placeholder="Enter a URL or email"
      defaultValue={resource?.support_channels || []}
    />
  );
}

function DocumentationURLs({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Documentation URLs"
      name="documentation_urls"
      label="Documentation URLs"
      placeholder="Enter documentation URLs"
      defaultValue={resource?.documentation_urls || []}
    />
  );
}

function TrainingMaterials({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      fieldTitle="Training Materials"
      name="training_materials"
      label="Training Materials"
      placeholder="Enter training material URLs"
      defaultValue={resource?.training_materials || []}
    />
  );
}

export default function SupportFormFields({ form, resource = null }) {
  return (
    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      <SupportChannels form={form} resource={resource} />
      <DocumentationURLs form={form} resource={resource} />
      <TrainingMaterials form={form} resource={resource} />
    </Stack>
  );
}
