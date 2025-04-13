export const getDefaultFilters = () => ({
  licenses: {},
  graspos: false,
  sortField: "views",
  sortDirection: "asc",
});

export function parseFiltersFromSearchParams(searchParams) {
  const filters = { ...getDefaultFilters() };

  searchParams.getAll("license").forEach((value) => {
    filters.licenses[value] = true;
  });

  const grasposParam = searchParams.get("graspos");
  filters.graspos = grasposParam === "true";

  const sortField = searchParams.get("sort_field") || "views";
  const sortDirection = searchParams.get("sort_direction") || "asc";
  filters.sortField = sortField;
  filters.sortDirection = sortDirection;

  return filters;
}

export function serializeFiltersToSearchParams(filters) {
  const searchParams = new URLSearchParams();

  Object.entries(filters.licenses).forEach(([license, selected]) => {
    if (selected) {
      searchParams.append("license", license);
    }
  });

  searchParams.set("graspos", String(filters.graspos));

  searchParams.set("sort_field", filters.sortField);
  searchParams.set("sort_direction", filters.sortDirection);

  return searchParams;
}

export function getResourceNameFromIndex(index, resourceMap) {
  return Object.keys(resourceMap).find((key) => resourceMap[key] === index);
}
