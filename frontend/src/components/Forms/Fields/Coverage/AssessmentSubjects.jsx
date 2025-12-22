import { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAssessments } from "@queries/assessment.js";
import CheckboxArrayField from "@helpers/CheckboxArrayField";

export default function AssessmentSubjects({ form, resource = null }) {
  const assessmentData = useAssessments();
  const [selectedAssessments, setSelectedAssessments] = useState([]);

  useEffect(() => {
    if (resource?.assessments) {
      const ids = resource.assessments.map((a) => a.id);
      setSelectedAssessments(ids);
      form?.setValue("assessments", ids);
    }
  }, [resource, form]);

  const handleSelectedAssessmentsChange = (newSelected) => {
    setSelectedAssessments(newSelected);
    form?.setValue("assessments", newSelected);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Assessment Subjects</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CheckboxArrayField
          items={assessmentData?.data?.data}
          selectedItems={selectedAssessments}
          setSelectedItems={handleSelectedAssessmentsChange}
          icons={true}
          colors={true}
        />
      </AccordionDetails>
    </Accordion>
  );
}
