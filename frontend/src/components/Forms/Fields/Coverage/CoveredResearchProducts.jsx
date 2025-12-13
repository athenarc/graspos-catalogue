import AccordionField from "@helpers/AccordionField";

export default function CoveredResearchProducts({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      name="covered_research_products"
      label="Covered Research Products"
      placeholder="Enter covered research products for the resource"
      fieldTitle="Covered Research Products *"
      required
      defaultValue={resource?.covered_research_products || []}
    />
  );
}
