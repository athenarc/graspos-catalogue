import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";

import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlagIcon from "@mui/icons-material/Flag";

import { useCountries } from "@queries/countries.js";

export default function GeographicScope({ form, resource = null }) {
  const countries = useCountries();
  const hasError = !!form?.formState?.errors?.geographical_coverage;

  const geographicalCoverage = useWatch({
    control: form.control,
    name: "geographical_coverage",
  });

  const isWorldwide =
    geographicalCoverage?.some(
      (c) =>
        c?.code?.toUpperCase() === "WW" ||
        c?.label?.toLowerCase() === "worldwide"
    ) || false;

  useEffect(() => {
    if (resource && countries?.data) {
      const initialCountries = resource?.geographical_coverage?.map((c) =>
        countries?.data?.data?.find((co) => co._id === c.id)
      );
      form?.setValue("geographical_coverage", initialCountries);
    }
  }, [resource, countries?.data, form?.setValue]);

  const handleWorldwideToggle = (checked) => {
    if (checked) {
      const worldwideCountry = countries?.data?.data?.find(
        (c) =>
          c.code?.toUpperCase() === "WW" ||
          c.label.toLowerCase() === "worldwide"
      ) || { label: "Worldwide", code: "WW" };
      form.setValue("geographical_coverage", [worldwideCountry]);
    } else {
      form.setValue("geographical_coverage", []);
    }
    form.trigger("geographical_coverage");
  };

  const filteredCountries =
    countries?.data?.data?.filter(
      (c) => c.label.toLowerCase() !== "worldwide"
    ) || [];

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
          Geographical Coverage *
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Alert
            severity="info"
            icon={<FlagIcon fontSize="small" />}
            sx={{
              backgroundColor: (theme) => theme.palette.action.hover,
              color: "text.secondary",
              borderRadius: 2,
              py: 1,
            }}
          >
            <Typography variant="body2">
              You can either select <strong>Worldwide</strong> or choose one or
              more specific countries.
            </Typography>
          </Alert>

          <Grid container spacing={2} alignItems="center">
            <Grid
              size={{ xs: 12, sm: 6 }}
              display="flex"
              justifyContent="center"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isWorldwide}
                    onChange={(e) => handleWorldwideToggle(e.target.checked)}
                  />
                }
                label="Worldwide"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="geographical_coverage"
                control={form?.control}
                rules={{
                  validate: (value) => {
                    if (isWorldwide) return true;
                    if (value && value.length > 0) return true;
                    return "At least one country or 'Worldwide' is required";
                  },
                }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    disabled={isWorldwide}
                    options={filteredCountries}
                    getOptionLabel={(option) => option?.label}
                    value={field?.value ?? []}
                    onChange={(_, value) => field.onChange(value)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...restTagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={option?._id || option?.code}
                            label={`${option?.label} (${option?.code})`}
                            {...restTagProps}
                            sx={{
                              borderRadius: "12px",
                              backgroundColor: "#f4f6f8",
                            }}
                          />
                        );
                      })
                    }
                    renderOption={(props, option) => (
                      <li key={option?._id} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={option?.flag}
                          alt=""
                          style={{ marginRight: 10 }}
                        />
                        {option?.label} ({option?.code})
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select countries"
                        placeholder="Start typing..."
                        error={hasError}
                        fullWidth
                      />
                    )}
                  />
                )}
              />
              {hasError && (
                <AlertHelperText
                  error={form?.formState?.errors?.geographical_coverage}
                />
              )}
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
