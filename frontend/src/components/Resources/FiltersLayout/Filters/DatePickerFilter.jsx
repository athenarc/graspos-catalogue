import { useCallback, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function DateFilter({ selectedFilters, onFilterChange }) {
  const { dateRange } = selectedFilters || {};

  const startDate = dateRange?.startDate ? new Date(dateRange.startDate) : null;
  const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : null;

  const handleDateRangeChange = useCallback(
    (newStartDate, newEndDate) => {
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
    [selectedFilters, onFilterChange]
  );

  useEffect(() => {}, [selectedFilters]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} sx={{ p: 0 }}>
      <DatePicker
        label="Start date"
        value={startDate}
        onChange={(newValue) => handleDateRangeChange(newValue, endDate)}
        disableFuture
        sx={{ width: { xs: "100%", lg: "50%" } }}
      />
      <DatePicker
        label="End date"
        value={endDate}
        onChange={(newValue) => handleDateRangeChange(startDate, newValue)}
        disableFuture
        sx={{ width: { xs: "100%", lg: "50%" } }}
      />
    </LocalizationProvider>
  );
}
