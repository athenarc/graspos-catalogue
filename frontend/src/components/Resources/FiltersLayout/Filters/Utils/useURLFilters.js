import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";

const getDefaultFilters = () => ({
  licenses: {},
  tags: [],
  scopes: {},
  graspos: false,
  sortField: "views",
  sortDirection: "desc",
  dateRange: {
    startDate: null,
    endDate: null,
  },
  text: "",
});

const normalizeToLocalMidnight = (date) => {
  if (!date) return null;
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};

const formatDateToLocalString = (date) => {
  const localDate = normalizeToLocalMidnight(date);
  return localDate.toISOString().split("T")[0];
};

export function useURLFilters(resourceMap) {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [selectedResource, setSelectedResource] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);

  const shouldSyncFilters = useMemo(() => {
    const detailPagePattern = /^\/(datasets|tools|documents)\/[^/]+$/;
    return !detailPagePattern.test(location.pathname);
  }, [location.pathname]);

  // Parse URL into filters + selected tab
  useEffect(() => {
    if (!shouldSyncFilters || isFirstLoad.current || location.pathname !== "/")
      return;

    const searchParams = new URLSearchParams();

    Object.entries(filters.licenses || {}).forEach(([key, value]) => {
      if (value) searchParams.append("license", key);
    });

    Object.entries(filters.scopes || {}).forEach(([key, value]) => {
      if (value) searchParams.append("scope", key);
    });

    filters.tags?.forEach((value) => {
      searchParams.append("tag", value);
    });

    searchParams.set("graspos", filters.graspos);
    searchParams.set("sort_field", filters.sortField);
    searchParams.set("sort_direction", filters.sortDirection);

    if (filters.dateRange?.startDate) {
      searchParams.set(
        "start",
        formatDateToLocalString(filters.dateRange.startDate)
      );
    }
    if (filters.dateRange?.endDate) {
      searchParams.set(
        "end",
        formatDateToLocalString(filters.dateRange.endDate)
      );
    }

    const resourceName = Object.keys(resourceMap).find(
      (key) => resourceMap[key] === selectedResource
    );
    if (resourceName) {
      searchParams.set("tab", resourceName);
    }

    navigate({ search: searchParams.toString() }, { replace: true });
  }, [
    filters,
    selectedResource,
    navigate,
    resourceMap,
    shouldSyncFilters,
    location.pathname,
  ]);

  // Sync filters to URL when state changes
  useEffect(() => {
    if (!shouldSyncFilters || isFirstLoad.current) return;

    const searchParams = new URLSearchParams();

    Object.entries(filters.licenses || {}).forEach(([key, value]) => {
      if (value) searchParams.append("license", key);
    });

    Object.entries(filters.scopes || {}).forEach(([key, value]) => {
      if (value) searchParams.append("scope", key);
    });

    filters.tags?.forEach((value) => {
      searchParams.append("tag", value);
    });

    searchParams.set("graspos", filters.graspos);
    searchParams.set("sort_field", filters.sortField);
    searchParams.set("sort_direction", filters.sortDirection);

    if (filters.dateRange?.startDate) {
      searchParams.set(
        "start",
        formatDateToLocalString(filters.dateRange.startDate)
      );
    }
    if (filters.dateRange?.endDate) {
      searchParams.set(
        "end",
        formatDateToLocalString(filters.dateRange.endDate)
      );
    }

    const resourceName = Object.keys(resourceMap).find(
      (key) => resourceMap[key] === selectedResource
    );
    if (resourceName) {
      searchParams.set("tab", resourceName);
    }

    navigate({ search: searchParams.toString() }, { replace: true });
  }, [filters, selectedResource, navigate, resourceMap, shouldSyncFilters]);

  const handleChangeFilters = (updatedFilter) => {
    setFilters((prev) => ({ ...prev, ...updatedFilter }));
  };

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
    const emptyFilters = getDefaultFilters();
    emptyFilters.text = filters.text;
    emptyFilters.graspos = filters.graspos;
    emptyFilters.scopes = filters.scopes;
    setFilters(emptyFilters);
  };

  const handleResetFilters = () => {
    setFilters(getDefaultFilters());
  };

  return {
    filters,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  };
}
