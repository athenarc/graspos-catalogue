import ArrayInputField from "./ArrayInputField";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AccordionField({
  form,
  fieldTitle,
  name,
  label,
  placeholder,
  required = false,
  defaultValue = [],
  checkbox = false,
  isChecked = false,
}) {
  const hasError = !!form?.formState?.errors?.[name];
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
          {fieldTitle}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} alignItems="center">
          {checkbox && (
            <Grid
              size={{ xs: 12, sm: 6 }}
              display="flex"
              justifyContent="center"
            >
              {checkbox}
            </Grid>
          )}
          <Grid
            size={{
              xs: 12,
              sm: checkbox ? 6 : 12,
            }}
          >
            <ArrayInputField
              form={form}
              name={name}
              label={label}
              placeholder={placeholder}
              required={required}
              defaultValue={defaultValue}
              disabled={isChecked}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
