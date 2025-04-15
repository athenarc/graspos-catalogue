import { Grid2 as Grid, Stack, TextField } from "@mui/material";
export default function SearchBar({
  resourceFilter,
  handleResourceFilterChange,
}) {
  return (
    <Stack sx={{ p: 2 }}>
      <Grid sx={{ margin: "auto", textAlign: "left" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          placeholder="Search Resource, abstract.."
          size="small"
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: "400px",
              md: "500px",
            },
          }}
        />
      </Grid>
    </Stack>
  );
}
