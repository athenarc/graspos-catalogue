import { Controller } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AssessmentFunctionalities({
  form,
  resource = null,
  resource_type = null,
}) {
  const menuItems = [
    {
      id: 1,
      value: "scholarly_data_enrichment_missing_attributes",
      label: "Scholarly data enrichment: Missing attributes",
      resource_types: ["all"],
    },
    {
      id: 2,
      value: "scholarly_data_enrichment_indicators",
      label: "Scholarly data enrichment: Indicators",
      resource_types: ["all"],
    },
    {
      id: 3,
      value: "scholarly_data_enrichment_semantics",
      label: "Scholarly data enrichment: Missing links & semantics",
      resource_types: ["all"],
    },
    {
      id: 4,
      value: "open_science_monitoring_researchers",
      label: "Open Science monitoring: Researchers",
      resource_types: ["all"],
    },
    {
      id: 5,
      value: "open_science_monitoring_institutions",
      label: "Open Science monitoring: Institutions",
      resource_types: ["all"],
    },
    {
      id: 6,
      value: "open_science_monitoring_countries",
      label: "Open Science monitoring: Countries",
      resource_types: ["all"],
    },
    {
      id: 7,
      value: "open_science_monitoring_general",
      label: "Open Science monitoring: General",
      resource_types: ["all"],
    },
    { id: 8, value: "data", label: "Data", resource_types: ["service"] },
    { id: 9, value: "other", label: "Other", resource_types: ["all"] },
  ];

  const filteredOptions = menuItems.filter(
    (item) =>
      item.resource_types.includes("all") ||
      item.resource_types.includes(resource_type)
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Assessment Functionalities</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Controller
            name="assessment_functionalities"
            control={form?.control}
            defaultValue={resource?.assessment_functionalities || []}
            render={({ field }) => (
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={filteredOptions}
                getOptionLabel={(option) => option?.label}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                value={filteredOptions?.filter((opt) =>
                  field?.value?.includes(opt?.value)
                )}
                onChange={(_, newValue) =>
                  field?.onChange(newValue?.map((opt) => opt?.value))
                }
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      key={option?.value}
                      label={option?.label}
                      {...getTagProps({ index })}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "#f4f6f8",
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assessment Functionalities"
                    error={!!form.formState.errors?.assessment_functionalities}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
}
