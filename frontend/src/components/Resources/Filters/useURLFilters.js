import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDefaultFilters } from "./filterUtils";

export function useURLFilters(resourceMap) {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [selectedResource, setSelectedResource] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = getDefaultFilters();

    searchParams.getAll("license").forEach((value) => {
      newFilters.licenses[value] = true;
    });

    const grasposParam = searchParams.get("graspos");
    newFilters.graspos = grasposParam === "true";

    const tab = searchParams.get("tab");
    if (tab && resourceMap[tab] !== undefined) {
      setSelectedResource(resourceMap[tab]);
    }

    const sortField = searchParams.get("sort_field") || "views";
    const sortDirection = searchParams.get("sort_direction") || "asc";
    newFilters.sortField = sortField;
    newFilters.sortDirection = sortDirection;

    setFilters(newFilters);
  }, [location.search]);

  const updateURL = (newFilters, selectedTab) => {
    const searchParams = new URLSearchParams();

    Object.entries(newFilters.licenses || {}).forEach(([key, value]) => {
      if (value) searchParams.append("license", key);
    });

    searchParams.set("graspos", newFilters.graspos);

    searchParams.set("sort_field", newFilters.sortField);
    searchParams.set("sort_direction", newFilters.sortDirection);

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
