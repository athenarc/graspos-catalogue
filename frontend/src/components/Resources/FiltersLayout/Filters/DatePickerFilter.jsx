import { Divider, Stack, Typography, Card } from "@mui/material";
import { useCallback, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function DateFilter({ selectedFilters, onFilterChange }) {
  const { dateRange } = selectedFilters || {};

  // Extract the start and end dates directly from selectedFilters
  const startDate = dateRange?.startDate ? new Date(dateRange.startDate) : null;
  const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : null;

  // Handle filter change when date range changes
  const handleDateRangeChange = useCallback(
    (newStartDate, newEndDate) => {
      // Only call onFilterChange if there is a change in the date range
      const hasChanged =
        (newStartDate &&
          newStartDate.toISOString() !== selectedFilters.dateRange.startDate) ||
        (newEndDate &&
          newEndDate.toISOString() !== selectedFilters.dateRange.endDate);

      if (hasChanged) {
        onFilterChange({
          dateRange: {
            startDate: newStartDate ? newStartDate.toISOString() : null,
            endDate: newEndDate ? newEndDate.toISOString() : null,
          },
        });
      }
    },
    [selectedFilters, onFilterChange] // Dependency on selectedFilters
  );

  useEffect(() => {
    // If the selectedFilters.dateRange is changed externally, no need to update state
    // This effect ensures that the component is properly synced with the parent
  }, [selectedFilters]);

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{ pl: 1, backgroundColor: "lightblue", color: "white" }}
      >
        Publication Date
      </Typography>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={2} p={2} sx={{ overflow: "auto", maxHeight: "20dvh" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => handleDateRangeChange(newValue, endDate)}
            disableFuture
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => handleDateRangeChange(startDate, newValue)}
            disableFuture
          />
        </Stack>
      </LocalizationProvider>
      <Divider />
    </Card>
  );
}
