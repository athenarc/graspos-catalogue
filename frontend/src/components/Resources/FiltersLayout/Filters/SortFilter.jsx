import {
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

export default function SortFilter({ filters, onFilterChange }) {
  const handleChange = (event) => {
    const [field, direction] = event.target.value.split("|");
    onFilterChange({ sortField: field, sortDirection: direction });
  };

  const getValue = () => `${filters.sortField}|${filters.sortDirection}`;

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{ pl: 1, backgroundColor: "lightblue", color: "white" }}
      >
        Sort By
      </Typography>
      <Divider />

      <Stack
        direction="column"
        spacing={2}
        p={2}
        sx={{ backgroundColor: "white" }}
      >
        <FormControl fullWidth>
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
    </Card>
  );
}
