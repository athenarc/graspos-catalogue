import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const getDefaultFilters = () => ({
  licenses: {},
  tags: [],
  service_type: [],
  scopes: {},
  assessments: {},
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
  const [shouldUpdateURL, setShouldUpdateURL] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);

  const latestFiltersRef = useRef(filters);
  useEffect(() => {
    latestFiltersRef.current = filters;
  }, [filters]);

  // Parse URL on load or when location.search changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = getDefaultFilters();

    searchParams.getAll("license").forEach((value) => {
      newFilters.licenses[value] = true;
    });
    searchParams.getAll("scope").forEach((value) => {
      newFilters.scopes[value] = true;
    });
    searchParams.getAll("assessment").forEach((value) => {
      newFilters.assessments[value] = true;
    });
    searchParams.getAll("geographical_coverage").forEach((value) => {
      newFilters.geographical_coverage[value] = true;
    });
    searchParams.getAll("tag").forEach((value) => {
      newFilters.tags.push(value);
    });
    searchParams.getAll("service_type").forEach((value) => {
      newFilters.service_type.push(value);
    });

    newFilters.graspos = searchParams.get("graspos") === "true";
    newFilters.sortField = searchParams.get("sort_field") || "unique_views";
    newFilters.sortDirection = searchParams.get("sort_direction") || "desc";

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

  // Handle URL update in effect
  useEffect(() => {
    if (!isFirstLoad.current && shouldUpdateURL) {
      const searchParams = new URLSearchParams();

      Object.entries(filters.licenses || {}).forEach(([key, value]) => {
        if (value) searchParams.append("license", key);
      });
      Object.entries(filters.scopes || {}).forEach(([key, value]) => {
        if (value) searchParams.append("scope", key);
      });
      Object.entries(filters.assessments || {}).forEach(([key, value]) => {
        if (value) searchParams.append("assessment", key);
      });
      Object.entries(filters.geographical_coverage || {}).forEach(
        ([key, value]) => {
          if (value) searchParams.append("geographical_coverage", key);
        }
      );
      filters.tags?.forEach((tag) => {
        searchParams.append("tag", tag);
      });
      filters.service_type?.forEach((service_type) => {
        searchParams.append("service_type", service_type);
      });
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
      setShouldUpdateURL(false);
    }
  }, [filters, selectedResource, shouldUpdateURL, navigate, resourceMap]);

  const handleChangeFilters = (updatedFilter) => {
    setFilters((prev) => ({ ...prev, ...updatedFilter }));
    setShouldUpdateURL(true);
  };

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);

    const reset = getDefaultFilters();
    reset.text = filters.text;
    reset.scopes = filters.scopes;
    reset.geographical_coverage = filters.geographical_coverage;
    reset.assessments = filters.assessments;

    setFilters(reset);
    setShouldUpdateURL(true);
  };

  const handleResetFilters = () => {
    const reset = getDefaultFilters();
    setFilters(reset);
    setShouldUpdateURL(true);
  };

  return {
    filters,
    selectedResource,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  };
}
