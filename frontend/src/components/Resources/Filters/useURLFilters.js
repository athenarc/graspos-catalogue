import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDefaultFilters } from "./filterUtils";

// Helper function to normalize dates to the local timezone and midnight
const normalizeToLocalMidnight = (date) => {
  if (!date) return null;

  // Get the local timezone offset in minutes
  const localTimezoneOffset = date.getTimezoneOffset();

  // Create a new Date object in local time, but with the time reset to midnight
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

  // Adjust for timezone difference to ensure the date is in local time
  const adjustedDate = new Date(
    localDate.getTime() - localTimezoneOffset * 60000
  );

  return adjustedDate;
};

// Function to format date to YYYY-MM-DD in local timezone
const formatDateToLocalString = (date) => {
  const localDate = normalizeToLocalMidnight(date);
  return localDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
};

export function useURLFilters(resourceMap) {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [selectedResource, setSelectedResource] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = getDefaultFilters();

    // Licenses
    searchParams.getAll("license").forEach((value) => {
      newFilters.licenses[value] = true;
    });

    // GraspOS Verified
    const grasposParam = searchParams.get("graspos");
    newFilters.graspos = grasposParam === "true";

    // Sorting
    const sortField = searchParams.get("sort_field") || "views";
    const sortDirection = searchParams.get("sort_direction") || "asc";
    newFilters.sortField = sortField;
    newFilters.sortDirection = sortDirection;

    // Date Range
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    if (startDate || endDate) {
      newFilters.dateRange = {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      };
    }

    // Tab / Resource
    const tab = searchParams.get("tab");
    if (tab && resourceMap[tab] !== undefined) {
      setSelectedResource(resourceMap[tab]);
    }

    setFilters(newFilters);
  }, [location.search]);

  const updateURL = (newFilters, selectedTab) => {
    const searchParams = new URLSearchParams();

    // Licenses
    Object.entries(newFilters.licenses || {}).forEach(([key, value]) => {
      if (value) searchParams.append("license", key);
    });

    // GraspOS Verified
    searchParams.set("graspos", newFilters.graspos);

    // Sort
    searchParams.set("sort_field", newFilters.sortField);
    searchParams.set("sort_direction", newFilters.sortDirection);

    // Date Range
    if (newFilters.dateRange?.startDate) {
      const startDate = new Date(newFilters.dateRange.startDate);
      if (!isNaN(startDate)) {
        // Adjust the start date to local timezone and set to midnight
        searchParams.set("start", formatDateToLocalString(startDate));
      }
    }
    if (newFilters.dateRange?.endDate) {
      const endDate = new Date(newFilters.dateRange.endDate);
      if (!isNaN(endDate)) {
        // Adjust the end date to local timezone and set to midnight
        searchParams.set("end", formatDateToLocalString(endDate));
      }
    }

    // Tab / Resource
    const resourceName = Object.keys(resourceMap).find(
      (key) => resourceMap[key] === selectedTab
    );
    if (resourceName) searchParams.set("tab", resourceName);

    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const handleChangeFilters = (updatedFilter) => {
    setFilters((prev) => {
      const next = { ...prev, ...updatedFilter };
      updateURL(next, selectedResource);
      return next;
    });
  };

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
    const emptyFilters = getDefaultFilters();
    setFilters(emptyFilters);
    updateURL(emptyFilters, newValue);
  };

  const handleResetFilters = () => {
    const reset = getDefaultFilters();
    setFilters(reset);
    updateURL(reset, selectedResource);
  };

  return {
    filters,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  };
}
