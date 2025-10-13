import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const getDefaultFilters = () => ({
  licenses: {},
  tags: [],
  service_type: [],
  trl: [],
  assessment_functionalities: [],
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
  assessment_values: [],
  evidence_types: [],
  covered_fields: [],
  covered_research_products: [],
});

// Define which filters are global vs local
const GLOBAL_FILTER_KEYS = new Set([
  "text",
  "scopes",
  "geographical_coverage",
  "assessments",
  "assessment_values",
  "evidence_types",
  "covered_fields",
  "covered_research_products",
]);

const LOCAL_FILTER_KEYS = new Set([
  "assessment_functionalities",
  "licenses",
  "tags",
  "service_type",
  "graspos",
  "sortField",
  "sortDirection",
  "dateRange",
  "trl",
]);

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

const splitFilters = (filters) => {
  const global = {};
  const local = {};
  for (const [key, value] of Object.entries(filters)) {
    if (GLOBAL_FILTER_KEYS.has(key)) global[key] = value;
    if (LOCAL_FILTER_KEYS.has(key)) local[key] = value;
  }
  return { global, local };
};

export function useURLFilters(resourceMap) {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [selectedResource, setSelectedResource] = useState(0);
  const [shouldUpdateURL, setShouldUpdateURL] = useState(false);
  const [shouldFetchAll, setShouldFetchAll] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);

  const latestFiltersRef = useRef(filters);
  useEffect(() => {
    latestFiltersRef.current = filters;
  }, [filters]);

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
    searchParams.getAll("assessment_functionalities").forEach((value) => {
      newFilters.assessment_functionalities.push(value);
    });
    searchParams.getAll("covered_fields").forEach((value) => {
      newFilters.covered_fields.push(value);
    });
    searchParams.getAll("covered_research_products").forEach((value) => {
      newFilters.covered_research_products.push(value);
    });
    searchParams.getAll("evidence_types").forEach((value) => {
      newFilters.evidence_types.push(value);
    });
    searchParams.getAll("assessment_values").forEach((value) => {
      newFilters.assessment_values.push(value);
    });
    searchParams.getAll("tag").forEach((value) => {
      newFilters.tags.push(value);
    });
    searchParams.getAll("service_type").forEach((value) => {
      newFilters.service_type.push(value);
    });
    searchParams.getAll("trl").forEach((value) => {
      newFilters.trl.push(value);
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
      filters.assessment_functionalities?.forEach(
        (assessment_functionality) => {
          searchParams.append(
            "assessment_functionalities",
            assessment_functionality
          );
        }
      );
      filters.service_type?.forEach((service_type) => {
        searchParams.append("service_type", service_type);
      });
      filters.trl?.forEach((trl) => {
        searchParams.append("trl", trl);
      });
      filters.covered_fields?.forEach((field) => {
        searchParams.append("covered_fields", field);
      });
      filters.covered_research_products?.forEach((product) => {
        searchParams.append("covered_research_products", product);
      });
      filters.evidence_types?.forEach((type) => {
        searchParams.append("evidence_types", type);
      });
      filters.assessment_values?.forEach((value) => {
        searchParams.append("assessment_values", value);
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

  const handleChangeFilters = (updated) => {
    const updatedKeys = Object.keys(updated);
    const onlyGlobal = updatedKeys.every((k) => GLOBAL_FILTER_KEYS.has(k));
    const onlyLocal = updatedKeys.every((k) => LOCAL_FILTER_KEYS.has(k));

    setFilters((prev) => ({ ...prev, ...updated }));
    setShouldUpdateURL(true);

    if (onlyGlobal) {
      setShouldFetchAll(true);
    } else if (onlyLocal) {
      setShouldFetchAll(false);
    } else {
      setShouldFetchAll(true);
    }
  };

  const handleSetSelectedResource = (event, newValue) => {
    setSelectedResource(newValue);
    const reset = getDefaultFilters();
    reset.text = filters.text;
    reset.scopes = filters.scopes;
    reset.geographical_coverage = filters.geographical_coverage;
    reset.assessments = filters.assessments;
    reset.assessment_values = filters.assessment_values;
    reset.evidence_types = filters.evidence_types;
    reset.covered_fields = filters.covered_fields;
    reset.covered_research_products = filters.covered_research_products;
    setFilters(reset);
    setShouldUpdateURL(true);
    setShouldFetchAll(false); // selecting a tab = local change
  };

  const handleResetFilters = () => {
    const reset = getDefaultFilters();
    setFilters(reset);
    setShouldUpdateURL(true);
    setShouldFetchAll(true);
  };

  const { global: globalFilters, local: localFilters } = splitFilters(filters);

  return {
    filters,
    globalFilters,
    localFilters,
    selectedResource,
    shouldFetchAll,
    handleChangeFilters,
    handleSetSelectedResource,
    handleResetFilters,
  };
}
