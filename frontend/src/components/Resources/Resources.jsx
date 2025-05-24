import { Grid2 as Grid } from "@mui/material";
import { Datasets } from "./Datasets/Datasets";
import { Documents } from "./Documents/Documents";
import { Tools } from "./Tools/Tools";
import { Box } from "@mui/material";

export default function ResourcesGrid({
  user,
  selectedResource,
  datasets,
  documents,
  tools,
}) {
  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Grid container spacing={2}>
        {selectedResource == 0 && <Datasets datasets={datasets} user={user} />}
        {selectedResource == 1 && <Tools tools={tools} user={user} />}
        {selectedResource == 2 && (
          <Documents documents={documents} user={user} />
        )}
      </Grid>
    </Box>
  );
}
