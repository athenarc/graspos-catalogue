import { useFieldArray, Controller } from "react-hook-form";
import { Stack, TextField, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef } from "react";

export default function ArrayInputField({
  form,
  name,
  label,
  placeholder = "",
  required = false,
}) {
  const { fields, append, remove } = useFieldArray({
    control: form?.control,
    name,
  });
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current && fields.length === 0 && required) {
      append(" ");
      didInit.current = true;
    }
  }, [fields, required, append]);
  return (
    <Stack direction="column" spacing={2}>
      {fields.map((field, index) => (
        <Stack key={field?.id} direction="row" spacing={1} alignItems="center">
          <Controller
            name={`${name}.${index}`}
            control={form?.control}
            rules={
              required && {
                required: label + " field is required and can not be empty",
                validate: (value) =>
                  value.trim() !== "" ||
                  label + " field is required and can not be empty",
              }
            }
            render={({ field }) => (
              <TextField
                {...field}
                key={field?.id}
                fullWidth
                placeholder={placeholder || `${label} ${index + 1}`}
                error={!!form?.formState?.errors?.[name]?.[index]}
                helperText={form?.formState?.errors?.[name]?.[index]?.message}
              />
            )}
          />
          {fields.length > 1 ||
            (!required && (
              <IconButton color="error" onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            ))}
        </Stack>
      ))}
      <Button
        endIcon={<AddIcon />}
        onClick={() => append(" ")}
        size="small"
        variant="outlined"
      >
        Add
      </Button>
    </Stack>
  );
}
