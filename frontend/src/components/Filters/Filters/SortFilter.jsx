import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const menuItems = [
  { value: "views|desc", label: "Views ↓", resources: [0, 1, 2] },
  { value: "views|asc", label: "Views ↑", resources: [0, 1, 2] },
  { value: "unique_views|desc", label: "Unique views ↓", resources: [0, 1, 2] },
  { value: "unique_views|asc", label: "Unique views ↑", resources: [0, 1, 2] },
  {
    value: "version_views|desc",
    label: "Version views ↓",
    resources: [0, 1, 2],
  },
  {
    value: "version_views|asc",
    label: "Version views ↑",
    resources: [0, 1, 2],
  },
  {
    value: "version_unique_views|desc",
    label: "Version views ↓",
    resources: [0, 1, 2],
  },
  {
    value: "version_unique_views|asc",
    label: "Version views ↑",
    resources: [0, 1, 2],
  },

  {
    value: "downloads|desc",
    label: "Downloads ↓",
    resources: [0, 1, 2],
  },
  {
    value: "downloads|asc",
    label: "Downloads ↑",
    resources: [0, 1, 2],
  },
  {
    value: "unique_downloads|desc",
    label: "Unique downloads ↓",
    resources: [0, 1, 2],
  },
  {
    value: "unique_downloads|asc",
    label: "Unique downloads ↑",
    resources: [0, 1, 2],
  },
  {
    value: "version_downloads|desc",
    label: "Version downloads ↓",
    resources: [0, 1, 2],
  },
  {
    value: "version_downloads|asc",
    label: "Version downloads ↑",
    resources: [0, 1, 2],
  },
  {
    value: "version_unique_downloads|desc",
    label: "Version unique downloads ↓",
    resources: [0, 1, 2],
  },
  {
    value: "version_unique_downloads|asc",
    label: "Version unique downloads ↑",
    resources: [0, 1, 2],
  },
  { value: "dates|desc", label: "Publication date ↓", resources: [0, 1, 2] },
  { value: "dates|asc", label: "Publication date ↑", resources: [0, 1, 2] },
  { value: "citations|desc", label: "Citations ↓", resources: [0, 1, 2] },
  { value: "citations|asc", label: "Citations ↑", resources: [0, 1, 2] },
];

export default function SortFilter({
  filters,
  onFilterChange,
  selectedResource,
}) {
  const options = menuItems.filter((item) =>
    item.resources.includes(selectedResource)
  );
  const handleChange = (event) => {
    const [field, direction] = event?.target?.value.split("|");
    onFilterChange({ sortField: field, sortDirection: direction });
  };

  const getValue = () => {
    return filters.sortField && filters.sortDirection
      ? `${filters.sortField}|${filters.sortDirection}`
      : options[0]?.value || "";
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{ width: { xs: "100%", lg: "60%" } }}
    >
      <InputLabel id="sort-filter-label">Sort by</InputLabel>
      <Select
        labelId="sort-filter-label"
        label="Sort by"
        value={getValue()}
        onChange={handleChange}
      >
        {options.map((opt) => (
          <MenuItem key={opt?.value} value={opt?.value}>
            {opt?.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
