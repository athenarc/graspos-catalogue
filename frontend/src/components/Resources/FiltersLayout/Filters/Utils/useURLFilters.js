import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

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

    // Parse selected tab
    const tab = searchParams.get("tab");
    const resourceIndex = resourceMap[tab];

    // Update selected resource only if different
    if (resourceIndex !== undefined && resourceIndex !== selectedResource) {
      setSelectedResource(resourceIndex);
    }

    // Update filters only if different
    const newFiltersJSON = JSON.stringify(newFilters);
    const currentFiltersJSON = JSON.stringify(filters);

    if (newFiltersJSON !== currentFiltersJSON) {
      newFilters.text = filters.text;
      setFilters(newFilters);
    }

    // Prevent updating URL on initial load
    isFirstLoad.current = false;
  }, [location.search]);

  const updateURL = (newFilters, selectedTab) => {
    if (isFirstLoad.current) return; // prevent router change on first load

    const searchParams = new URLSearchParams();

    Object.entries(newFilters.licenses || {}).forEach(([key, value]) => {
      if (value) searchParams.append("license", key);
    });

    Object.entries(newFilters.scopes || {}).forEach(([key, value]) => {
      if (value) searchParams.append("scope", key);
    });

    newFilters.tags?.forEach((value) => {
      searchParams.append("tag", value);
    });

    searchParams.set("graspos", newFilters.graspos);
    searchParams.set("sort_field", newFilters.sortField);
    searchParams.set("sort_direction", newFilters.sortDirection);

    if (newFilters.dateRange?.startDate) {
      searchParams.set(
        "start",
        formatDateToLocalString(newFilters.dateRange.startDate)
      );
    }
    if (newFilters.dateRange?.endDate) {
      searchParams.set(
        "end",
        formatDateToLocalString(newFilters.dateRange.endDate)
      );
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
    const urlEmptyFilters = emptyFilters;
    urlEmptyFilters.text = filters.text;
    urlEmptyFilters.graspos = filters.graspos;
    urlEmptyFilters.scopes = filters.scopes;
    setFilters(urlEmptyFilters);
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
