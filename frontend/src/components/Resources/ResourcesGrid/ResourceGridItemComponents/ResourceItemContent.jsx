import {
  Stack,
  Typography,
  Tooltip,
  Chip,
  Divider,
  Box,
  Collapse,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { stripHtml } from "../../../../utils/utils";

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
    value: "open_science_monitoring_data",
    label: "Open Science monitoring: Data",
  },
  {
    value: "open_science_monitoring_other",
    label: "Open Science monitoring: Other",
  },
];

const functionalityLabelMap = Object.fromEntries(
  assessmentFunctionalityMenuItems.map((i) => [i.value, i.label])
);

function ExpandableChips({ items = [], labelMap = null }) {
  return (
    <Stack>
      <Stack direction="row" flexWrap="wrap">
        {items?.map((item, idx) => (
          <Chip
            key={idx}
            label={labelMap?.[item] || item}
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

// --- Generic Section Component ---
function ResourceItemChipsSection({
  title,
  items = [],
  labelMap = null,
  limit = 5,
  icon = null,
}) {
  const [expanded, setExpanded] = useState(false);
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
          <Typography variant="subtitle2">{title}</Typography>
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
                : `Show all (${items.length - limit} more)`}
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

// --- Keywords ---
export function ResourceItemKeywords({ resource }) {
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
    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
      <Tooltip title="Tags">
        <LocalOfferIcon fontSize="small" color="action" />
      </Tooltip>
      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {keywords.map((k) => (
          <Chip
            key={k}
            label={k}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

// --- Main Content ---
export default function ResourceItemContent({ resource }) {
  const description =
    resource?.zenodo?.metadata?.description ||
    resource?.openaire?.metadata?.description ||
    "No description available";

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

      {/* Keywords */}
      <ResourceItemKeywords resource={resource} />

      <Divider flexItem sx={{ my: 0.5 }} />

      {/* Assessment Functionalities */}
      <ResourceItemChipsSection
        title="Assessment Functionalities"
        items={resource?.assessment_functionalities}
        labelMap={functionalityLabelMap}
        limit={3}
        icon={<AssessmentIcon fontSize="small" color="action" />}
      />

      <Divider flexItem sx={{ my: 0.5 }} />

      {/* Evidence Types */}
      <ResourceItemChipsSection
        title="Evidence Types"
        items={resource?.evidence_types}
        labelMap={Object.fromEntries(
          evidenceTypesMenuItems.map((i) => [i.value, i.label])
        )}
      />

      <Divider flexItem sx={{ my: 0.5 }} />

      {/* Assessment Values */}
      <ResourceItemChipsSection
        title="Assessment Values"
        items={resource?.assessment_values}
      />

      <Divider flexItem sx={{ my: 0.5 }} />

      {/* Covered Fields */}
      <ResourceItemChipsSection
        title="Covered Fields"
        items={resource?.covered_fields}
      />

      <Divider flexItem sx={{ my: 0.5 }} />

      {/* Covered Research Products */}
      <ResourceItemChipsSection
        title="Covered Research Products"
        items={resource?.covered_research_products}
      />

      <Divider flexItem sx={{ my: 0.5 }} />
    </Stack>
  );
}
