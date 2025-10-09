import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FlagIcon from "@mui/icons-material/Flag";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import { useScopes } from "@queries/scope.js";
import { useCountries } from "@queries/countries.js";
import { useAssessments } from "@queries/assessment.js";
import AccordionField from "../Helpers/AccordionField";
import AlertHelperText from "../Helpers/AlertHelperText";

function CheckboxArrayField({
  items,
  selectedItems,
  setSelectedItems,
  icons = false,
  colors = false,
}) {
  const handleToggle = (id) => {
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter((i) => i !== id)
      : [...selectedItems, id];
    setSelectedItems(newSelected); // ενημερώνει το state
  };

  const renderIcon = (name) => {
    switch (name) {
      case "Researcher":
        return <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case "Researcher team/group":
        return <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case "Research organization":
        return <AccountBalanceIcon fontSize="small" sx={{ mr: 0.5 }} />;
      default:
        return (
          <FlagIcon fontSize="small" sx={{ mr: 0.5, color: "text.primary" }} />
        );
    }
  };

  return (
    <Grid container spacing={1}>
      {items?.map((item) => (
        <Grid size={{ xs: 12, sm: 6 }} key={item._id}>
          <Tooltip title={item.description || ""}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleToggle(item._id)}
                  sx={{
                    color: item.bg_color && colors ? item.bg_color : "#1976d2",
                  }}
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  {icons && renderIcon(item.name)}
                  <span>{item.name}</span>
                </Box>
              }
            />
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
}

function AssessmentValues({ form }) {
  return (
    <AccordionField
      form={form}
      name="assessment_values"
      label="Assessment Values"
      placeholder="Enter assessment values for the resource"
      fieldTitle="Assessment Values"
    />
  );
}

function ScopeStages({ form, resource = null }) {
  const scopesQuery = useScopes();
  const [selectedScopes, setSelectedScopes] = useState([]);

  // Initial load: set selected scopes from resource
  useEffect(() => {
    if (resource?.scopes) {
      const ids = resource.scopes.map((s) => s.id);
      setSelectedScopes(ids);
      form?.setValue("scopes", ids);
    }
  }, [resource, form]);

  const handleSelectedScopesChange = (newSelected) => {
    setSelectedScopes(newSelected);
    form?.setValue("scopes", newSelected);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Scope Methodology Stages</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CheckboxArrayField
          items={scopesQuery?.data?.data}
          selectedItems={selectedScopes}
          setSelectedItems={handleSelectedScopesChange}
          icons={false}
          colors={true}
        />
      </AccordionDetails>
    </Accordion>
  );
}

function AssessmentSubjects({ form, resource = null }) {
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

function GeographicScope({ form, resource = null }) {
  const countries = useCountries();
  const hasError = !!form?.formState?.errors?.geographical_coverage;

  // compute initial value
  useEffect(() => {
    if (resource && countries?.data) {
      const initialCountries = resource?.geographical_coverage.map((c) =>
        countries?.data?.data?.find((co) => co._id === c.id)
      );
      form?.setValue("geographical_coverage", initialCountries);
    }
  }, [resource, countries?.data, form?.setValue]);

  return (
    <Accordion
      sx={{
        border: (theme) =>
          hasError
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid transparent`,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" color={hasError ? "error" : "inherit"}>
          Geographical Coverage *
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Controller
          name="geographical_coverage"
          control={form?.control}
          rules={{
            validate: (value) =>
              (value && value.length > 0) || "At least one country is required",
          }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={countries?.data?.data || []}
              getOptionLabel={(option) => option?.label}
              value={field?.value ?? []}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const tagProps = getTagProps({ index });
                  const { key, ...rest } = tagProps; // Remove key from the spread, jsx warning
                  return (
                    <Chip
                      key={option?._id}
                      label={`${option?.label} (${option?.code})`}
                      {...rest}
                    />
                  );
                })
              }
              renderOption={(props, option) => {
                const { key, ...rest } = props; // Remove key from the spread, jsx warning
                return (
                  <li key={option?._id} {...rest}>
                    <img
                      loading="lazy"
                      width="20"
                      src={option?.flag}
                      alt=""
                      style={{ marginRight: 10 }}
                    />
                    {option?.label} ({option?.code})
                  </li>
                );
              }}
              renderInput={(params) => (
                <>
                  <TextField
                    {...params}
                    label="Select countries"
                    placeholder="Start typing..."
                    error={hasError}
                    fullWidth
                  />
                  {hasError && (
                    <AlertHelperText
                      error={form?.formState?.errors?.geographical_coverage}
                    />
                  )}
                </>
              )}
            />
          )}
        />
      </AccordionDetails>
    </Accordion>
  );
}

function CoveredFields({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      name="covered_fields"
      label="Covered Fields"
      placeholder="Enter covered fields for the resource"
      fieldTitle="Covered Fields *"
      required
      defaultValue={resource?.covered_fields || []}
    />
  );
}

function CoveredResearchProducts({ form, resource = null }) {
  return (
    <AccordionField
      form={form}
      name="covered_research_products"
      label="Covered Research Products"
      placeholder="Enter covered research products for the resource"
      fieldTitle="Covered Research Products *"
      required
      defaultValue={resource?.covered_fields || []}
    />
  );
}

function AssessmentFunctionalities({
  form,
  resource = null,
  resource_type = null,
}) {
  const menuItems = [
    {
      value: "scholarly_data_enrichment_missing_attributes",
      label: "Scholarly data enrichment: Missing attributes",
      resource_types: ["all"],
    },
    {
      value: "scholarly_data_enrichment_indicators",
      label: "Scholarly data enrichment: Indicators",
      resource_types: ["all"],
    },
    {
      value: "scholarly_data_enrichment_semantics",
      label: "Scholarly data enrichment: Missing links & semantics",
      resource_types: ["all"],
    },
    {
      value: "open_science_monitoring_researchers",
      label: "Open Science monitoring: Researchers",
      resource_types: ["all"],
    },
    {
      value: "open_science_monitoring_institutions",
      label: "Open Science monitoring: Institutions",
      resource_types: ["all"],
    },
    {
      value: "open_science_monitoring_countries",
      label: "Open Science monitoring: Countries",
      resource_types: ["all"],
    },
    {
      value: "open_science_monitoring_general",
      label: "Open Science monitoring: General",
      resource_types: ["all"],
    },
    {
      value: "open_science_monitoring_data",
      label: "Open Science monitoring: Data",
      resource_types: ["service"],
    },
    {
      value: "open_science_monitoring_other",
      label: "Open Science monitoring: Other",
      resource_types: ["all"],
    },
  ];
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Assessment Functionalities</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <InputLabel>Assessment Functionalities</InputLabel>
          <Controller
            name="assessment_functionalities"
            control={form?.control}
            defaultValue={resource?.assessment_functionalities || []}
            label="Assessment Functionalities"
            render={({ field }) => (
              <Select
                multiple
                label="Assessment Functionalities"
                value={field.value || []}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(Array.isArray(value) ? value : []);
                }}
              >
                {menuItems
                  .filter(
                    (item) =>
                      item.resource_types.includes("all") ||
                      item.resource_types.includes(resource_type)
                  )
                  .map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
}

function EvidenceTypes({ form, resource = null }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Evidence Types</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <InputLabel>Evidence Types</InputLabel>
          <Controller
            name="evidence_types"
            control={form?.control}
            defaultValue={resource?.evidence_types || []}
            render={({ field }) => (
              <Select
                multiple
                label="Evidence Types"
                value={field.value || []}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(Array.isArray(value) ? value : []);
                }}
              >
                <MenuItem value="narratives">Narratives</MenuItem>
                <MenuItem value="indicators">Indicators</MenuItem>
                <MenuItem value="list_of_contributions">
                  List Of Contributions
                </MenuItem>
                <MenuItem value="badges">Badges</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
}

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
    </Stack>
  );
}
