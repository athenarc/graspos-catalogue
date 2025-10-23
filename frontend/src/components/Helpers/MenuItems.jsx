const evidenceTypesMenuItems = [
  { value: "indicators", label: "Indicators" },
  { value: "narratives", label: "Narratives" },
  { value: "list_of_contributions", label: "List of Contributions" },
  { value: "badges", label: "Badges" },
  { value: "other", label: "Other" },
];

const assessmentFunctionalityMenuItems = [
  {
    value: "scholarly_data_enrichment_missing_attributes",
    label: "Scholarly data enrichment: Missing attributes",
  },
  {
    value: "scholarly_data_enrichment_indicators",
    label: "Scholarly data enrichment: Indicators",
  },
  {
    value: "scholarly_data_enrichment_semantics",
    label: "Scholarly data enrichment: Missing links & semantics",
  },
  {
    value: "open_science_monitoring_researchers",
    label: "Open Science monitoring: Researchers",
  },
  {
    value: "open_science_monitoring_institutions",
    label: "Open Science monitoring: Institutions",
  },
  {
    value: "open_science_monitoring_countries",
    label: "Open Science monitoring: Countries",
  },
  {
    value: "open_science_monitoring_general",
    label: "Open Science monitoring: General",
  },
  {
    value: "data",
    label: "Data",
  },
  {
    value: "other",
    label: "Other",
  },
];

const functionalityLabelMap = Object.fromEntries(
  assessmentFunctionalityMenuItems?.map((i) => [i.value, i.label])
);

function getLabelForAssessmentFunctionality(value) {
  const item = assessmentFunctionalityMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}
function getLabelForEvidenceType(value) {
  const item = evidenceTypesMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}

export {
  evidenceTypesMenuItems,
  assessmentFunctionalityMenuItems,
  functionalityLabelMap,
  getLabelForAssessmentFunctionality,
  getLabelForEvidenceType,
};
