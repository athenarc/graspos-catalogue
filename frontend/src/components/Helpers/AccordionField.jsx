import ArrayInputField from "./ArrayInputField";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
        <ArrayInputField
          form={form}
          name={name}
          label={label}
          placeholder={placeholder}
          required={required}
        />
      </AccordionDetails>
    </Accordion>
  );
}
