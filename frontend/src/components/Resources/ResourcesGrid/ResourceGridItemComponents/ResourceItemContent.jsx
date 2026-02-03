import {
  Stack,
  Typography,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  Box,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { stripHtml } from "@utils/utils";
import {
  getLabelForAssessmentFunctionality,
  getLabelForEvidenceType,
  getLabelForCoveredResearchProducts,
  getLabelForCoveredFields,
} from "@helpers/MenuItems";

function ExpandableChips({ items = [], labelMap = null }) {
  const itemsArray = Array.isArray(items) ? items : [items];

  return (
    <Stack>
      <Stack direction="row" flexWrap="wrap">
        {itemsArray.map((item, idx) => (
          <Chip
            key={idx}
            label={
              typeof labelMap === "function"
                ? labelMap(item)
                : labelMap?.[item]?.label || item
            }
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "6px",
              mr: 1,
              mb: 1,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function ResourceItemChipsSection({
  title,
  items = [],
  labelMap = null,
  limit = 5,
  icon = null,
}) {
  const [expanded, setExpanded] = useState(false);
  items = Array.isArray(items) ? items : [items];
  const hasMore = items?.length > limit;
  const visible = expanded ? items : items?.slice(0, limit);
  if (!items?.length)
    return (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontStyle: "italic" }}
      >
        No {title.toLowerCase()} available
      </Typography>
    );

  return (
    <Stack spacing={0.5}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon && <Tooltip title={title}>{icon}</Tooltip>}
        </Stack>
        {hasMore && (
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "primary.main",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Typography variant="caption" sx={{ mr: 0.3 }}>
              {expanded
                ? "Show less"
                : `Show all (${items?.length - limit} more)`}
            </Typography>
            <ExpandMoreIcon
              sx={{
                transform: expanded ? "rotate(180deg)" : "none",
                transition: "transform 0.3s",
              }}
              fontSize="small"
            />
          </Box>
        )}
      </Stack>
      <ExpandableChips
        items={visible}
        labelMap={labelMap}
        limit={limit}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </Stack>
  );
}

export function ResourceItemKeywords({ resource, showIcon = true }) {
  const keywords =
    resource?.zenodo?.metadata?.keywords ||
    resource?.openaire?.metadata?.tags ||
    [];
  if (!keywords.length)
    return (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontStyle: "italic" }}
      >
        No tags available
      </Typography>
    );

  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      spacing={2}
      sx={{ mx: "0px !important;" }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={1}
        gap={1}
        sx={{ mx: "0px !important;" }}
      >
        {keywords?.map((k) => (
          <Chip
            key={k}
            label={k}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ marginLeft: "0px !important;" }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ flex: 1, p: 2 }}>
      {value === index && children}
    </Box>
  );
}

export default function ResourceItemContent({ resource, isMobile }) {
  const description =
    resource?.zenodo?.metadata?.description ||
    resource?.openaire?.metadata?.description ||
    "No description available";

  const [value, setValue] = useState(0);

  const allTabsMapping = {
    evidence_types: {
      title: "Evidence Types",
      icon: <AssessmentIcon fontSize="small" color="action" />,
      items: resource?.metadata?.evidence_types || [],
      labelMap: getLabelForEvidenceType,
      displayTab: true,
    },
    assessment_functionalities: {
      title: "Assessment Functionalities",
      icon: <AssessmentIcon fontSize="small" color="action" />,
      items: resource?.metadata?.assessment_functionalities || [],
      labelMap: getLabelForAssessmentFunctionality,
      displayTab:
        resource?.resource_type.toLowerCase() === "service" ||
        resource?.resource_type.toLowerCase() === "tool",
    },
    assessment_values: {
      title: "Assessment Values",
      icon: <AssessmentIcon fontSize="small" color="action" />,
      items: resource?.metadata?.assessment_values || [],
      labelMap: null,
      displayTab: true,
    },
    covered_fields: {
      title: "Covered Fields",
      icon: <AssessmentIcon fontSize="small" color="action" />,
      items: resource?.metadata?.covered_fields || [],
      labelMap: getLabelForCoveredFields,
      displayTab: true,
    },
    covered_research_products: {
      title: "Covered Research Products",
      icon: <AssessmentIcon fontSize="small" color="action" />,
      items: resource?.metadata?.covered_research_products || [],
      labelMap: getLabelForCoveredResearchProducts,
      displayTab: true,
    },
    temporal_coverage: {
      title: "Temporal Coverage",
      icon: <AssessmentIcon fontSize="small" color="action" />,
      items: resource?.metadata?.temporal_coverage || [],
      labelMap: null,
      displayTab: true,
    },
  };

  const visibleTabs = Object.entries(allTabsMapping).filter(
    ([, { displayTab }]) => displayTab,
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsEntries = Object.entries(allTabsMapping);
  return (
    <Stack spacing={2}>
      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {stripHtml(description)}
      </Typography>

      <ResourceItemKeywords resource={resource} />

      <Box
        sx={{
          display: "flex",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            minWidth: 220,
          }}
        >
          {visibleTabs?.map(
            ([key, { title, icon, displayTab }], index) =>
              displayTab && (
                <Tab
                  key={key}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{title}</span>
                    </Box>
                  }
                  sx={{ alignItems: "flex-start", textAlign: "left" }}
                />
              ),
          )}
        </Tabs>

        {visibleTabs?.map(
          ([key, { title, items, labelMap, displayTab }], index) =>
            displayTab && (
              <TabPanel key={key} value={value} index={index}>
                <ResourceItemChipsSection
                  title={title}
                  items={resource?.[key] || []}
                  labelMap={labelMap}
                  limit={20}
                />
              </TabPanel>
            ),
        )}
      </Box>
    </Stack>
  );
}
