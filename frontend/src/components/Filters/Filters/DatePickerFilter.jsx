import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { Box, Typography, Divider } from "@mui/material";
import { isValid, isAfter } from "date-fns";

export default function DateFilter({ selectedFilters, onFilterChange }) {
  const { dateRange } = selectedFilters || {};
  const initialStart = dateRange?.startDate
    ? new Date(dateRange.startDate)
    : null;
  const initialEnd = dateRange?.endDate ? new Date(dateRange.endDate) : null;

  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  // Validate and update filter on date change
  useEffect(() => {
    setStartDateError("");
    setEndDateError("");

    const now = new Date();
    let hasError = false;

    if (startDate && (!isValid(startDate) || isAfter(startDate, now))) {
      setStartDateError("Start date must be valid and not in the future.");
      hasError = true;
    }

    if (endDate && (!isValid(endDate) || isAfter(endDate, now))) {
      setEndDateError("End date must be valid and not in the future.");
      hasError = true;
    }

    if (startDate && endDate && startDate > endDate) {
      setEndDateError("End date cannot be before start date.");
      hasError = true;
    }

    if (!hasError) {
      onFilterChange({
        dateRange: {
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
        },
      });
    }
  }, [startDate, endDate, onFilterChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Typography variant="h6" gutterBottom>
        Publication Dates
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box display="flex" flexDirection="column" gap={3}>
        <DatePicker
          label="Start date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          format="dd/MM/yyyy"
          disableFuture
          slotProps={{
            textField: {
              error: !!startDateError,
              helperText: startDateError || "",
            },
          }}
        />
        <DatePicker
          label="End date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          format="dd/MM/yyyy"
          disableFuture
          slotProps={{
            textField: {
              error: !!endDateError,
              helperText: endDateError || "",
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
