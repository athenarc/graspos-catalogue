import { Stack, Card, Button } from "@mui/material";

export default function SortFilter({ filters, onFilterChange }) {
  const handleSortChange = (field) => {
    const newDirection =
      filters.sortField === field && filters.sortDirection === "asc"
        ? "desc"
        : "asc";
    onFilterChange({ sortField: field, sortDirection: newDirection });
  };

  return (
    <Card sx={{ backgroundColor: "lightblue" }}>
      <Stack direction="column" spacing={2} p={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleSortChange("views")}
          sx={{ backgroundColor: "white" }}
        >
          Sort by Views{" "}
          {filters.sortField === "views"
            ? filters.sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleSortChange("downloads")}
          sx={{ backgroundColor: "white" }}
        >
          Sort by Downloads{" "}
          {filters.sortField === "downloads"
            ? filters.sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleSortChange("dates")}
          sx={{ backgroundColor: "white" }}
        >
          Sort by Publication Dates{" "}
          {filters.sortField === "dates"
            ? filters.sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </Button>
      </Stack>
    </Card>
  );
}
