import { Checkbox, FormControlLabel } from "@mui/material";
import { useWatch } from "react-hook-form";

import AccordionField from "@helpers/AccordionField";

export default function CoveredFields({ form, resource = null }) {
  const name = "covered_fields";
  const defaultValue = resource?.covered_fields || [];
  const coveredFields = useWatch({ control: form.control, name });
  const isFieldAgnosticChecked = coveredFields?.includes("Field Agnostic");

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    let newValue = [...(coveredFields || [])];

    if (checked && !newValue.includes("Field Agnostic")) {
      newValue = ["Field Agnostic"];
    } else if (!checked) {
      newValue = [""];
    }

    form.clearErrors(name);
    form.setValue(name, newValue, { shouldValidate: true });
  };

  return (
    <AccordionField
      form={form}
      name={name}
      label="Enter covered fields"
      fieldTitle="Covered Fields *"
      required
      defaultValue={defaultValue}
      isChecked={isFieldAgnosticChecked}
      checkbox={
        <FormControlLabel
          control={
            <Checkbox
              checked={isFieldAgnosticChecked || false}
              onChange={handleCheckboxChange}
            />
          }
          label="Field Agnostic"
        />
      }
    />
  );
}
