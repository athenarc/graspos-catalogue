import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import {
  Stack,
  TextField,
  Button,
  IconButton,
  Typography,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AlertHelperText from "./AlertHelperText";

/**
 * Generic repeatable metadata field group
 * Supports objects and primitive arrays
 */
export default function DynamicFieldGroup({
  form,
  searchedResource,
  fieldName,
  fieldSchema, // optional fallback schema: e.g. { name: "", affiliation: "", orcid: "" }
  disabled = true,
}) {
  const metadata = searchedResource?.metadata ?? {};
  const existingData = metadata[fieldName] || [];

  const { control, register, formState } = form || {};
  const { fields, append, remove } = useFieldArray({
    control,
    name: `metadata.${fieldName}`,
  });

  const [expanded, setExpanded] = useState(false);

  const isPrimitiveArray =
    existingData.length > 0 && typeof existingData[0] !== "object";
  const subfieldKeys = fieldSchema
    ? Object.keys(fieldSchema)
    : existingData.length > 0
      ? isPrimitiveArray
        ? ["value"]
        : Object.keys(existingData[0])
      : ["value"];

  useEffect(() => {
    const currentValues = form.getValues(`metadata.${fieldName}`) || [];
    if (existingData.length > 0 && currentValues.length === 0) {
      const dataToAppend = existingData.map((item) =>
        typeof item === "object" ? item : { value: item }
      );
      append(dataToAppend);
    }
  }, []);
  const errors = formState?.errors;
  const hasMultiple = fields.length > 1;

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        </Typography>
        {!disabled && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() =>
              append(
                isPrimitiveArray
                  ? { value: "" }
                  : Object.fromEntries(subfieldKeys.map((k) => [k, ""]))
              )
            }
          >
            Add {fieldName.slice(0, -1)}
          </Button>
        )}
      </Stack>

      {fields.length > 0 &&
        renderDynamicRow({
          index: 0,
          fieldName,
          subfieldKeys,
          register,
          errors,
          remove,
          disabled,
        })}

      {hasMultiple && (
        <Collapse in={expanded} sx={{ marginTop: "0px !important;" }}>
          {fields.slice(1).map((_, index) =>
            renderDynamicRow({
              index: index + 1,
              fieldName,
              subfieldKeys,
              register,
              errors,
              remove,
              disabled,
            })
          )}
        </Collapse>
      )}

      {hasMultiple && (
        <Button
          size="small"
          variant="text"
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setExpanded(!expanded)}
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
        >
          {expanded ? "Hide" : `Show All (${fields.length})`}
        </Button>
      )}
    </Stack>
  );
}

function renderDynamicRow({
  index,
  fieldName,
  subfieldKeys,
  register,
  errors,
  remove,
  disabled = true,
}) {
  return (
    <Stack
      key={index}
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ mt: 0 }}
    >
      {subfieldKeys.map((key) => (
        <Stack key={key} spacing={1} sx={{ flexGrow: 1 }}>
          <TextField
            key={key === "value" ? `${fieldName.slice(0, -1)}-${index + 1}` : `${key}-${index + 1}`}
            disabled={disabled}
            {...register(`metadata.${fieldName}.${index}.${key}`)}
            label={
              key === "value" ? fieldName.slice(0, -1) : key
            }
            fullWidth
            error={!!errors?.metadata?.[fieldName]?.[index]?.[key]}
            helperText=" "
          />
          {errors?.metadata?.[fieldName]?.[index]?.[key] && (
            <AlertHelperText
              key={`error-${fieldName}-${index}-${key}`}
              error={errors?.metadata?.[fieldName]?.[index]?.[key]}
            />
          )}
        </Stack>
      ))}
      {!disabled && subfieldKeys.length > 0 && (
        <IconButton key={`remove-${fieldName}-${index}`} color="error" onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      )}
    </Stack>
  );
}
