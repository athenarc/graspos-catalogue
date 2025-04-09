import { Divider, Drawer, Stack, Typography } from "@mui/material";

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
