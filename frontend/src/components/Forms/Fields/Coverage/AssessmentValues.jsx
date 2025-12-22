import AccordionField from "@helpers/AccordionField";

export default function AssessmentValues({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      name="assessment_values"
      label="Assessment Values"
      placeholder="Enter assessment values for the resource"
      fieldTitle="Assessment Values"
      defaultValue={resource?.assessment_values || []}
    />
  );
}
