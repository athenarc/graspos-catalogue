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
import { Controller } from "react-hook-form";
import { evidenceTypesMenuItems } from "@helpers/MenuItems";

export default function EvidenceTypes({ form, resource = null }) {
  const options = evidenceTypesMenuItems;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Evidence Types</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Controller
            name="evidence_types"
            control={form?.control}
            defaultValue={resource?.evidence_types || []}
            render={({ field }) => (
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={options}
                getOptionLabel={(option) => option?.label ?? ""}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                value={options.filter((opt) =>
                  field.value?.includes(opt.value)
                )}
                onChange={(_, newValue) =>
                  field.onChange(newValue?.map((opt) => opt?.value))
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
                    label="Evidence Types"
                    placeholder="Select or type..."
                    error={!!form?.formState?.errors?.evidence_types}
                    helperText={
                      form?.formState?.errors?.evidence_types?.message
                    }
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
