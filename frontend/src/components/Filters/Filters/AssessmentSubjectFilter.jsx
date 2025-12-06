import {
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Card,
  Tooltip,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { FilterVariants } from "@helpers/Skeleton";
import { renderIcon } from "@helpers/MenuItems";
import { useAssessmentsWithCount } from "@queries/assessment";

export default function AssessmentFacetFilter({
  selectedFilters,
  onFilterChange,
}) {
  const { data: assessmentData, isLoading } = useAssessmentsWithCount();
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
        <Typography variant="h6">By assessment subjects</Typography>
        <Tooltip
          title="SCOPE Framework for Research Evaluation | INORMS
The SCOPE framework for research evaluation is a five-stage model for evaluating responsibly. It is a practical step-by-step process designed to help research managers, or anyone involved in conducting research evaluations, in planning new evaluations as well as check existing evaluations."
        >
          <HelpOutlineIcon />
        </Tooltip>
      </Stack>

      <Divider />
      <List sx={{ px: 2 }}>
        {isLoading ? (
          <FilterVariants count={5} />
        ) : assessmentData?.data?.length > 0 ? (
          assessmentData.data.map((assessment) => (
            <Tooltip title={assessment?.description} key={assessment?._id}>
              <ListItem
                key={assessment?._id}
                onClick={() => handleToggle(assessment?._id)}
                sx={{ p: 0, cursor: "pointer" }}
              >
                <Checkbox
                  edge="start"
                  checked={!!selectedAssessments[assessment?._id]}
                  tabIndex={-1}
                  disableRipple
                  sx={{ p: 1 }}
                />
                <div
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minWidth: 0,
                    marginRight: 8,
                  }}
                >
                  <ListItemText
                    primary={assessment?.name}
                    sx={{ mr: 1 }}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: { fontSize: "0.875rem" },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flexShrink: 0, ml: 1, whiteSpace: "nowrap" }}
                    title={`Resource count: ${assessment?.usage_count}`}
                  >
                    ({assessment?.usage_count})
                  </Typography>
                </div>
                {renderIcon(assessment?.name)}
              </ListItem>
            </Tooltip>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No assessments available</Typography>
        )}
      </List>
      <Divider />
    </Card>
  );
}
