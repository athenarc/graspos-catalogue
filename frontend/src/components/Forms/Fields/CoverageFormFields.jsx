import { Stack } from "@mui/material";

import AssessmentValues from "@fields/Coverage/AssessmentValues";
import AssessmentSubjects from "@fields/Coverage/AssessmentSubjects";
import ScopeStages from "@fields/Coverage/ScopeStages";
import GeographicScope from "@fields/Coverage/GeographicScope";
import CoveredFields from "@fields/Coverage/CoveredFields";
import CoveredResearchProducts from "@fields/Coverage/CoveredResearchProducts";
import EvidenceTypes from "@fields/Coverage/EvidenceTypes";
import AssessmentFunctionalities from "@fields/Coverage/AssessmentFunctionalities";
import TemporalCoverage from "@fields/Coverage/TemporalCoverage";

export default function CoverageFormFields({
  resourceType,
  form,
  resource = null,
}) {
  const resource_type = resource?.resource_type || resourceType;
  return (
    <Stack direction="column" spacing={2}>
      <ScopeStages form={form} resource={resource} />
      <AssessmentSubjects form={form} resource={resource} />
      <GeographicScope form={form} resource={resource} />
      <CoveredFields form={form} resource={resource} />
      <CoveredResearchProducts form={form} resource={resource} />
      <EvidenceTypes form={form} resource={resource} />
      <AssessmentValues form={form} resource={resource} />
      {(resource_type === "tool" || resource_type === "service") && (
        <AssessmentFunctionalities
          form={form}
          resource={resource}
          resource_type={resource_type}
        />
      )}
      <TemporalCoverage form={form} resource={resource} />
    </Stack>
  );
}
