import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { Box, Button, Divider, Typography } from "@mui/material";
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

  const handleApply = () => {
    setStartDateError("");
    setEndDateError("");

    const now = new Date();
    let hasError = false;

    if (startDate && (!isValid(startDate) || isAfter(startDate, now))) {
      setStartDateError("Start date must be a valid date not in the future.");
      hasError = true;
    }

    if (endDate && (!isValid(endDate) || isAfter(endDate, now))) {
      setEndDateError("End date must be a valid date not in the future.");
      hasError = true;
    }

    if (startDate && endDate && startDate > endDate) {
      setEndDateError("Start date cannot be after end date.");
      hasError = true;
    }

    if (hasError) return;

    onFilterChange({
      dateRange: {
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      },
    });
  };
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setStartDateError("");
    setEndDateError("");

    onFilterChange({
      dateRange: {
        startDate: null,
        endDate: null,
      },
    });
  };

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

        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={handleReset} variant="outlined">
            Reset
          </Button>
          <Button onClick={handleApply} variant="contained">
            Apply
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
