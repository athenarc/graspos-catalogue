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

  // ✅ Only sync on resource overview pages
  const shouldSyncFilters = useMemo(() => {
    return location.pathname === "/" || location.pathname === "/resources";
    // Add more allowed paths if needed
  }, [location.pathname]);

  // Parse URL into filters and selectedResource
  useEffect(() => {
    if (!shouldSyncFilters) return;

    const searchParams = new URLSearchParams(location.search);
    const newFilters = getDefaultFilters();

    searchParams.getAll("license").forEach((value) => {
      newFilters.licenses[value] = true;
    });

    searchParams.getAll("scope").forEach((value) => {
      newFilters.scopes[value] = true;
    });

    searchParams.getAll("tag").forEach((value) => {
      newFilters.tags.push(value);
    });

    newFilters.graspos = searchParams.get("graspos") === "true";
    newFilters.sortField = searchParams.get("sort_field") || "views";
    newFilters.sortDirection = searchParams.get("sort_direction") || "asc";

    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    newFilters.dateRange = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    const tab = searchParams.get("tab");
    const resourceIndex = resourceMap[tab];

    if (resourceIndex !== undefined && resourceIndex !== selectedResource) {
      setSelectedResource(resourceIndex);
    }

    const newFiltersJSON = JSON.stringify(newFilters);
    const currentFiltersJSON = JSON.stringify(filters);

    if (newFiltersJSON !== currentFiltersJSON) {
      newFilters.text = filters.text;
      setFilters(newFilters);
    }

    isFirstLoad.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, shouldSyncFilters]);

  // Sync filters to URL
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
