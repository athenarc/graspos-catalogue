import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function SortFilter({ filters, onFilterChange }) {
  const handleChange = (event) => {
    const [field, direction] = event.target.value.split("|");
    onFilterChange({ sortField: field, sortDirection: direction });
  };

  const getValue = () => `${filters.sortField}|${filters.sortDirection}`;

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
        <MenuItem value="unique_views|desc">Views ↓</MenuItem>
        <MenuItem value="unique_views|asc">Views ↑</MenuItem>
        <MenuItem value="unique_downloads|desc">Downloads ↓</MenuItem>
        <MenuItem value="unique_downloads|asc">Downloads ↑</MenuItem>
        <MenuItem value="dates|desc">Publication date ↓</MenuItem>
        <MenuItem value="dates|asc">Publication date ↑</MenuItem>
      </Select>
    </FormControl>
  );
}
