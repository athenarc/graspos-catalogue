export default function AccordionField({ control, errors, trigger, watch }) {
  return (
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
  );
}
