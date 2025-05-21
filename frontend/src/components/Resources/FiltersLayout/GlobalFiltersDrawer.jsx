import {
  Drawer,
  Stack,
  useMediaQuery,
  useTheme,
  Fab,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";

export default function ResourcesFiltersDrawer({
  ResourceFilters,
  resourceFiltersProps,
  onResetFilters,
  isMobile,
  theme,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      {isMobile && (
        <Fab
          color="primary"
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 124,
            right: 24,
            width: 40,
            height: 40,
            zIndex: theme.zIndex.drawer + 2,
          }}
        >
          <FilterAltIcon />
        </Fab>
      )}

      <Drawer
        sx={{
          width: 350,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 350,
            height: "100vh",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? mobileOpen : true}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Stack gap={2} sx={{ mt: 9 }}>
          <Typography
            variant="h5"
            sx={{
              px: 2,
              pt: 2,
              pb: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Filters
          </Typography>

          <Divider sx={{ m: 0, pb: 0 }} />
          <ResourceFilters {...resourceFiltersProps} />
        </Stack>

        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              if (isMobile) toggleDrawer();
              onResetFilters(false);
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
