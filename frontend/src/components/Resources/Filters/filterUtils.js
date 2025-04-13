export const getDefaultFilters = () => ({
  licenses: {},
  graspos: false,
});

// Parses URLSearchParams into a filters object.
export function parseFiltersFromSearchParams(searchParams) {
  const filters = { ...getDefaultFilters() };

  // License filters
  searchParams.getAll("license").forEach((value) => {
    filters.licenses[value] = true;
  });

  // GraspOS verified filter
  const grasposParam = searchParams.get("graspos");
  filters.graspos = grasposParam === "true";

  return filters;
}

// Serializes a filters object into URLSearchParams.
export function serializeFiltersToSearchParams(filters) {
  const searchParams = new URLSearchParams();

  // License filters
  Object.entries(filters.licenses).forEach(([license, selected]) => {
    if (selected) {
      searchParams.append("license", license);
    }
  });

  // GraspOS verified filter
  searchParams.set("graspos", String(filters.graspos));

  return searchParams;
}

// Converts a numeric resource tab to its name (e.g., 0 -> datasets).
export function getResourceNameFromIndex(index, resourceMap) {
  return Object.keys(resourceMap).find((key) => resourceMap[key] === index);
}
