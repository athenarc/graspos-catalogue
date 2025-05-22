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
      <InputLabel id="sort-filter-label">Sort results by</InputLabel>
      <Select
        labelId="sort-filter-label"
        label="Sort Results By"
        value={getValue()}
        onChange={handleChange}
      >
        <MenuItem value="views|desc">Views ↓</MenuItem>
        <MenuItem value="views|asc">Views ↑</MenuItem>
        <MenuItem value="downloads|desc">Downloads ↓</MenuItem>
        <MenuItem value="downloads|asc">Downloads ↑</MenuItem>
        <MenuItem value="dates|desc">Publication date ↓</MenuItem>
        <MenuItem value="dates|asc">Publication date ↑</MenuItem>
      </Select>
    </FormControl>
  );
}
