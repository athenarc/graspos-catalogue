import { useFieldArray, Controller } from "react-hook-form";
import { Stack, TextField, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef } from "react";
import AlertHelperText from "./AlertHelperText";

export default function ArrayInputField({
  form,
  name,
  label,
  placeholder = "",
  required = false,
  defaultValue = [],
}) {
  const { fields, append, remove, replace } = useFieldArray({
    control: form?.control,
    name,
  });

  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      if (defaultValue && defaultValue.length > 0) {
        replace(defaultValue);
        form?.setValue(name, defaultValue);
      } else if (required && fields.length === 0) {
        append("");
      }
      didInit.current = true;
    }
  }, [defaultValue, replace, append, form, name, required]);

  return (
    <Stack direction="column" spacing={2}>
      {fields.map((field, index) => (
        <Stack key={field.id} direction="row" spacing={1} alignItems="center">
          <Stack direction="column" flex={1}>
            <Controller
              name={`${name}.${index}`}
              control={form?.control}
              rules={
                required && {
                  required: `${label} field is required and cannot be empty`,
                  validate: (value) =>
                    value?.trim() !== "" ||
                    `${label} field is required and cannot be empty`,
                }
              }
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    fullWidth
                    placeholder={placeholder || `${label} ${index + 1}`}
                    error={!!form?.formState?.errors?.[name]?.[index]}
                    helperText=" "
                  />
                  {form?.formState?.errors?.[name]?.[index] && (
                    <AlertHelperText
                      error={form?.formState?.errors?.[name]?.[index]}
                    />
                  )}
                </>
              )}
            />
          </Stack>
          {(!required || (required && fields.length > 1)) && (
            <IconButton color="error" onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ))}
      <Button
        endIcon={<AddIcon />}
        onClick={() => append("")}
        size="small"
        variant="outlined"
      >
        Add
      </Button>
    </Stack>
  );
}
