export const getDefaultFilters = () => ({
  licenses: {},
  graspos: false,
  sortField: "views",
  sortDirection: "asc",
  dateRange: {
    startDate: null,
    endDate: null,
  },
});

export function parseFiltersFromSearchParams(searchParams) {
  const filters = { ...getDefaultFilters() };

  // Licenses
  searchParams.getAll("license").forEach((value) => {
    filters.licenses[value] = true;
  });

  // GraspOS Verified
  const grasposParam = searchParams.get("graspos");
  filters.graspos = grasposParam === "true";

  // Sorting
  const sortField = searchParams.get("sort_field") || "views";
  const sortDirection = searchParams.get("sort_direction") || "asc";
  filters.sortField = sortField;
  filters.sortDirection = sortDirection;

  // Date Range Parsing with Midnight for startDate and 23:59:59 for endDate
  const startDateParam = searchParams.get("start");
  const endDateParam = searchParams.get("end");

  if (startDateParam) {
    const startDate = new Date(startDateParam);
    startDate.setHours(0, 0, 0, 0); // Set time to midnight
    filters.dateRange.startDate = startDate;
  }

  if (endDateParam) {
    const endDate = new Date(endDateParam);
    endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59
    filters.dateRange.endDate = endDate;
  }

  return filters;
}

export function serializeFiltersToSearchParams(filters) {
  const searchParams = new URLSearchParams();

  // Licenses
  Object.entries(filters.licenses).forEach(([license, selected]) => {
    if (selected) {
      searchParams.append("license", license);
    }
  });

  // GraspOS Verified
  searchParams.set("graspos", String(filters.graspos));

  // Sorting
  searchParams.set("sort_field", filters.sortField);
  searchParams.set("sort_direction", filters.sortDirection);

  // Date Range Serialization with Midnight for startDate and 23:59:59 for endDate
  const { startDate, endDate } = filters.dateRange || {};
  if (startDate instanceof Date && !isNaN(startDate)) {
    // Convert the startDate to string and set time to midnight
    startDate.setHours(0, 0, 0, 0);
    searchParams.set("start", startDate.toISOString().split("T")[0]);
  }

  if (endDate instanceof Date && !isNaN(endDate)) {
    // Convert the endDate to string and set time to 23:59:59
    endDate.setHours(23, 59, 59, 999);
    searchParams.set("end", endDate.toISOString().split("T")[0]);
  }

  return searchParams;
}

export function getResourceNameFromIndex(index, resourceMap) {
  return Object.keys(resourceMap).find((key) => resourceMap[key] === index);
}
