import {
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Card,
  Avatar,
  Tooltip,
  Stack,
} from "@mui/material";

import { useAssessments } from "../../../../queries/assessment";
import { useEffect, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function AssessmentFacetFilter({
  selectedFilters,
  onFilterChange,
}) {
  const { data: assessmentData } = useAssessments();
  const [selectedAssessments, setSelectedAssessments] = useState(
    selectedFilters?.assessments || {}
  );

  useEffect(() => {
    if (!assessmentData?.data) return;

    const validSelectedAssessments = Object.keys(
      selectedFilters?.assessments || {}
    ).reduce((acc, assessmentId) => {
      const assessmentExists = assessmentData.data.some(
        (assessment) => assessment._id === assessmentId
      );
      if (assessmentExists) {
        acc[assessmentId] = selectedFilters.assessments[assessmentId];
      }
      return acc;
    }, {});

    if (
      JSON.stringify(validSelectedAssessments) !==
      JSON.stringify(selectedAssessments)
    ) {
      setSelectedAssessments(validSelectedAssessments);
      onFilterChange({ assessments: validSelectedAssessments });
    }
  }, [selectedFilters, assessmentData, selectedAssessments, onFilterChange]);

  const handleToggle = (assessmentId) => {
    const updatedAssessments = {
      ...selectedAssessments,
      [assessmentId]: !selectedAssessments[assessmentId],
    };
    setSelectedAssessments(updatedAssessments);
    onFilterChange({ assessments: updatedAssessments });
  };

  return (
    <Card>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1, backgroundColor: "lightblue", color: "white" }}
      >
        <Typography variant="h6">By assessment stages</Typography>
        <Tooltip
          title="SCOPE Framework for Research Evaluation | INORMS
The SCOPE framework for research evaluation is a five-stage model for evaluating responsibly. It is a practical step-by-step process designed to help research managers, or anyone involved in conducting research evaluations, in planning new evaluations as well as check existing evaluations."
        >
          <HelpOutlineIcon />
        </Tooltip>
      </Stack>

      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {assessmentData?.data?.length > 0 ? (
          assessmentData.data.map((assessment) => (
            <ListItem
              key={assessment._id}
              onClick={() => handleToggle(assessment._id)}
              sx={{ p: 0 }}
            >
              <Checkbox
                edge="start"
                checked={!!selectedAssessments[assessment._id]}
                tabIndex={-1}
                disableRipple
                sx={{ p: 1 }}
              />
              <ListItemText
                primary={assessment.name}
                sx={{ mr: 1 }}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontSize: "0.875rem" },
                }}
              />
              <Tooltip title={assessment.description}>
                {assessment?.name === "Researcher" ? (
                  <PersonIcon fontSize="small" />
                ) : assessment?.name === "Researcher team/group" ? (
                  <GroupIcon fontSize="small" />
                ) : assessment?.name === "Research organization" ? (
                  <AccountBalanceIcon fontSize="small" />
                ) : (
                  <FlagIcon fontSize="small" color="text.primary"/>
                )}
              </Tooltip>
            </ListItem>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No assessments available</Typography>
        )}
      </List>
      <Divider />
    </Card>
  );
}
