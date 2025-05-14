import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

export default function SortFilter({ filters, onFilterChange }) {
  const handleChange = (event) => {
    const [field, direction] = event.target.value.split("|");
    onFilterChange({ sortField: field, sortDirection: direction });
  };

  const getValue = () => `${filters.sortField}|${filters.sortDirection}`;

  return (
    <Stack direction="column" spacing={2} p={2}>
      <FormControl fullWidth variant="filled">
        <InputLabel id="sort-filter-label">Sort By</InputLabel>
        <Select
          labelId="sort-filter-label"
          value={getValue()}
          label="Sort By"
          onChange={handleChange}
        >
          <MenuItem value="views|asc">Views ↑</MenuItem>
          <MenuItem value="views|desc">Views ↓</MenuItem>
          <MenuItem value="downloads|asc">Downloads ↑</MenuItem>
          <MenuItem value="downloads|desc">Downloads ↓</MenuItem>
          <MenuItem value="dates|asc">Publication Dates ↑</MenuItem>
          <MenuItem value="dates|desc">Publication Dates ↓</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
