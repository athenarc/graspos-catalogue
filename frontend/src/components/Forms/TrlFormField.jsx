import { useEffect } from "react";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useTrls } from "@queries/trl";
import { Controller } from "react-hook-form";
import AlertHelperText from "@helpers/AlertHelperText";

export default function TrlFormField({
  form,
  name = "trl",
  label,
  required = false,
  resource = null,
  searchedResource = null,
  disabled = false,
}) {
  const { data: trls, isLoading, isSuccess } = useTrls();
  const hasError = !!form?.formState?.errors?.[name];

  const selectedTrl =
    resource?.trl?.id || searchedResource?.metadata?.trl?.id || "";

  useEffect(() => {
    const newValue = selectedTrl || "";
    form?.setValue(name, newValue);
  }, [selectedTrl]);

  return (
    <>
      {isLoading && <CircularProgress size={24} />}
      {isSuccess && (
        <FormControl variant="outlined" sx={{ flex: 1 }}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Controller
            name={name}
            control={form.control}
            defaultValue={selectedTrl || ""}
            rules={
              required && {
                required: "TRL is required",
              }
            }
            render={({ field }) => (
              <Select
                {...field}
                labelId={`${name}-label`}
                label={label}
                error={hasError}
                value={field?.value ?? selectedTrl ?? ""}
                fullWidth
                disabled={!!searchedResource?.metadata?.trl}
                onChange={(e) => field?.onChange(e?.target?.value)}
                sx={{ backgroundColor: "#fff" }}
                endAdornment={
                  field.value && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange("");
                      }}
                      sx={{ mr: 2}}
                    >
                      {!disabled && <ClearIcon fontSize="small" />}
                    </IconButton>
                  )
                }
              >
                {trls?.data?.map((trl) => (
                  <MenuItem key={trl._id} value={trl._id}>
                    {trl?.trl_id + " - " + trl?.european_description}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {hasError && required && (
            <AlertHelperText
              error={form?.formState?.errors?.trl || "TRL is required"}
            />
          )}
        </FormControl>
      )}
    </>
  );
}
