import { Autocomplete, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller } from "react-hook-form";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControl,
} from "@mui/material";

import AlertHelperText from "@helpers/AlertHelperText";
import { coveredResearchProductsMenuItems } from "@helpers/MenuItems";

export default function CoveredResearchProducts({ form, resource = null }) {
  const options = coveredResearchProductsMenuItems;
  const hasError = !!form?.formState?.errors?.covered_fields;
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" color={hasError ? "error" : "inherit"}>
          Covered Research Products *
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Controller
            name="covered_research_products"
            control={form?.control}
            defaultValue={resource?.covered_research_products || []}
            required
            rules={{
              required: "At least one covered research field is required",
            }}
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
                    label="Covered Research Fields"
                    placeholder="Select or type..."
                    error={hasError}
                  />
                )}
              />
            )}
          />
        </FormControl>
        {hasError && (
          <AlertHelperText
            error={form?.formState?.errors?.geographical_coverage}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
}
