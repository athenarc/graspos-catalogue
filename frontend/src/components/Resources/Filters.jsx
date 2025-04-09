import {
  Divider,
  Drawer,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function ResourcesFilters() {
  return (
    <Drawer
      sx={{
        width: 200,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack direction="column" spacing={2} sx={{ marginTop: "10vh" }}>
        <Typography sx={{ p: 2 }}>License</Typography>
      </Stack>
      <Divider />
    </Drawer>
  );
}

export function ResourcesFilterBar({
  resourceFilter,
  handleResourceFilterChange,
}) {
  return (
    <Stack sx={{ p: 2 }}>
      <Grid size={12} sx={{ margin: "auto", textAlign: "left" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          placeholder="Search Resource.."
          size="small"
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
        />
      </Grid>
    </Stack>
  );
}
