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
import { assessmentFunctionalityMenuItems } from "@helpers/MenuItems";

export default function AssessmentFunctionalities({
  form,
  resource = null,
  resource_type = null,
}) {

  const filteredOptions = assessmentFunctionalityMenuItems?.filter(
    (item) =>
      item?.resource_types?.includes("all") ||
      item?.resource_types?.includes(resource_type)
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
                  selected.map((option, index) => {
                    const { key, ...restTagProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={option?.value}
                        label={option?.label}
                        {...restTagProps}
                        sx={{
                          borderRadius: "12px",
                          backgroundColor: "#f4f6f8",
                        }}
                      />
                    );
                  })
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
