import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const getDefaultFilters = () => ({
  licenses: {},
  tags: [],
  scopes: {},
  geographical_coverage: {},
  graspos: false,
  sortField: "unique_views",
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
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function useURLFilters(resourceMap) {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [selectedResource, setSelectedResource] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isFirstLoad = useRef(true);
  const [textState, setTextState] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = getDefaultFilters();

    // Parse filters from URL
    searchParams.getAll("license").forEach((value) => {
      newFilters.licenses[value] = true;
    });

    searchParams.getAll("scope").forEach((value) => {
      newFilters.scopes[value] = true;
    });

    searchParams.getAll("geographical_coverage").forEach((value) => {
      newFilters.geographical_coverage[value] = true;
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
  }, [location.search]);

  const updateURL = (newFilters, selectedTab) => {
    if (isFirstLoad.current) return;

    const searchParams = new URLSearchParams();

    Object.entries(newFilters.licenses || {}).forEach(([key, value]) => {
      if (value) searchParams.append("license", key);
    });

    Object.entries(newFilters.scopes || {}).forEach(([key, value]) => {
      if (value) searchParams.append("scope", key);
    });

    Object.entries(newFilters.geographical_coverage || {}).forEach(([key, value]) => {
      if (value) searchParams.append("geographical_coverage", key);
    });

    newFilters.tags?.forEach((value) => {
      searchParams.append("tag", value);
    });

    searchParams.set("sort_field", newFilters.sortField);
    searchParams.set("sort_direction", newFilters.sortDirection);

    if (newFilters.dateRange?.startDate) {
      searchParams.set("start", formatDateToLocalString(newFilters.dateRange.startDate));
    }
    if (newFilters.dateRange?.endDate) {
      searchParams.set("end", formatDateToLocalString(newFilters.dateRange.endDate));
    }

    const resourceName = Object.keys(resourceMap).find(
      (key) => resourceMap[key] === selectedTab
    );
    if (resourceName) {
      searchParams.set("tab", resourceName);
    }

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
    emptyFilters.text = filters.text;
    emptyFilters.scopes = filters.scopes;
    emptyFilters.geographical_coverage = filters.geographical_coverage;
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
