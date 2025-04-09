import { Grid2 as Grid } from "@mui/material";
import { Datasets } from "./Datasets/Datasets";
import { Documents } from "./Documents/Documents";
import { Tools } from "./Tools/Tools";

export default function ResourcesGrid({
  user,
  selectedResource,
  resourceFilter,
  filters,
}) {
  return (
    <Grid
      container
      spacing={2}
      m={2}
      mt={0}
      sx={{ maxHeight: "75vh", overflow: "auto" }}
    >
      {selectedResource == 0 && (
        <Datasets user={user} filter={resourceFilter} filters={filters} />
      )}

      {selectedResource == 1 && (
        <Documents user={user} filter={resourceFilter} filters={filters} />
      )}

      {selectedResource == 2 && (
        <Tools user={user} filter={resourceFilter} filters={filters} />
      )}
    </Grid>
  );
}
