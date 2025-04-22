import { Grid2 as Grid } from "@mui/material";
import { Datasets } from "./Datasets/Datasets";
import { Documents } from "./Documents/Documents";
import { Tools } from "./Tools/Tools";
import { Box } from "@mui/material";

export default function ResourcesGrid({
  user,
  selectedResource,
  resourceFilter,
  filters,
}) {
  return (
    <Box sx={{ maxHeight: "85.5dvh", overflowY: "auto", p: 2 }}>
      <Grid container spacing={2}>
        {selectedResource == 0 && (
          <Datasets user={user} filter={resourceFilter} filters={filters} />
        )}
        {selectedResource == 1 && (
          <Tools user={user} filter={resourceFilter} filters={filters} />
        )}
        {selectedResource == 2 && (
          <Documents user={user} filter={resourceFilter} filters={filters} />
        )}
      </Grid>
    </Box>
  );
}
