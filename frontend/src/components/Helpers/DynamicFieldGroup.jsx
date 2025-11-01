import { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  IconButton,
  Collapse,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useFieldArray } from "react-hook-form";

export default function DynamicFieldGroupSmart({
  form,
  searchedResource,
  fieldName,
  fieldSchema,
  disabled = true,
}) {
  const metadata = searchedResource?.metadata ?? {};
  const { control, register, formState, getValues } = form || {};
  const { fields, append, remove } = useFieldArray({
    control,
    name: `metadata.${fieldName}`,
  });

  const errors = formState?.errors;
  const existingData = metadata?.[fieldName] || [];
  const isPrimitiveArray =
    existingData?.length > 0 && typeof existingData[0] !== "object";
  const subfieldKeys = fieldSchema
    ? Object.keys(fieldSchema)
    : existingData?.length > 0
    ? isPrimitiveArray
      ? ["value"]
      : Object.keys(existingData[0])
    : ["value"];

  // Initial append if form empty
  useEffect(() => {
    const currentValues = getValues?.(`metadata.${fieldName}`) || [];
    if (currentValues?.length === 0 && existingData?.length > 0) {
      append(
        existingData.map((item) =>
          typeof item === "object" ? item : { value: item }
        )
      );
    }
  }, [append, existingData, fieldName, getValues]);

  // ---------- Primitive array ----------
  if (isPrimitiveArray) {
    return (
      <Stack spacing={2}>
        {fields?.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No {fieldName.slice(0, -1)} added yet.
          </Typography>
        )}

        <Stack
          spacing={2}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
          }}
        >
          {fields?.map((field, idx) => {
            const fieldPath = `metadata.${fieldName}.${idx}.value`;
            return (
              <Stack
                key={fieldPath}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ marginTop: "0px !important;" }}
              >
                <TextField
                  disabled={disabled}
                  {...(register ? register(fieldPath) : {})}
                  value={field?.value ?? ""}
                  fullWidth
                  size="small"
                  margin="dense"
                  variant="outlined"
                  label={`${fieldName} ${idx + 1}`}
                  placeholder=""
                  error={!!errors?.metadata?.[fieldName]?.[idx]?.value}
                  helperText={
                    errors?.metadata?.[fieldName]?.[idx]?.value?.message || ""
                  }
                  sx={{
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
                {!disabled && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => remove(idx)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            );
          })}
        </Stack>

        {!disabled && (
          <Button
            startIcon={<AddIcon />}
            size="small"
            variant="outlined"
            onClick={() => append({ value: "" })}
            sx={{ alignSelf: "flex-start" }}
          >
            Add {fieldName.slice(0, -1)}
          </Button>
        )}
      </Stack>
    );
  }

  // ---------- Array of objects ----------
  const [expandedRows, setExpandedRows] = useState(fields.map(() => false));
  const toggleRow = (index) => {
    const newExpanded = [...expandedRows];
    newExpanded[index] = !newExpanded[index];
    setExpandedRows(newExpanded);
  };

  const [showExtra, setShowExtra] = useState(false);
  const toggleExtra = () => setShowExtra((v) => !v);

  const renderHeader = (field) => (
    <Typography variant="body2" color="text.secondary" noWrap>
      {subfieldKeys
        ?.map((k) => `${field?.[k] ?? ""}`)
        ?.filter(Boolean)
        ?.join(" | ")}
    </Typography>
  );

  const renderRow = (index) => {
    const field = fields[index];
    return (
      <Card
        key={field?.id || index}
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 1,
          transition: "0.3s",
          boxShadow: 1,
          "&:hover": { boxShadow: 4, borderColor: "primary.main" },
        }}
      >
        <CardHeader
          title={null}
          subheader={renderHeader(field)}
          action={
            <Stack direction="row" spacing={1}>
              {!disabled && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton size="small" onClick={() => toggleRow(index)}>
                {expandedRows[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          }
        />
        <Collapse in={expandedRows[index]} timeout="auto">
          <CardContent sx={{ px: 2, pt: 0, paddingBottom: "16px !important;" }}>
            <Stack spacing={2}>
              {subfieldKeys.map((key) => {
                const fieldPath = `metadata.${fieldName}.${index}.${key}`;
                return (
                  <TextField
                    key={fieldPath}
                    disabled={disabled}
                    {...(register ? register(fieldPath) : {})}
                    label={key}
                    fullWidth
                    size="small"
                    margin="dense"
                    variant="outlined"
                    error={!!errors?.metadata?.[fieldName]?.[index]?.[key]}
                    helperText={
                      errors?.metadata?.[fieldName]?.[index]?.[key]?.message ||
                      ""
                    }
                    sx={{
                      backgroundColor: "#fafafa",
                      "& .MuiOutlinedInput-root": { borderRadius: 1 },
                    }}
                  />
                );
              })}
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  return (
    <Stack spacing={2}>
      {fields.slice(0, 5).map((_, idx) => renderRow(idx))}

      {fields?.length > 5 && (
        <Collapse in={showExtra} timeout="auto">
          {fields.slice(5).map((_, idx) => renderRow(idx + 5))}
        </Collapse>
      )}

      {!disabled && (
        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="outlined"
          onClick={() =>
            append(Object.fromEntries(subfieldKeys?.map((k) => [k, ""])))
          }
          sx={{ alignSelf: "flex-start" }}
        >
          Add {fieldName.slice(0, -1)}
        </Button>
      )}

      {fields?.length > 5 && (
        <Button
          size="small"
          variant="text"
          startIcon={showExtra ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={toggleExtra}
          sx={{ textTransform: "none", alignSelf: "flex-start" }}
        >
          {showExtra ? "Hide" : `Show All (${fields.length - 3} more)`}
        </Button>
      )}
    </Stack>
  );
}
