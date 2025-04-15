import {
  Drawer,
  Stack,
  useMediaQuery,
  useTheme,
  Fab,
  Button,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";

export default function ResourcesFiltersDrawer({
  ResourceFilters,
  resourceFiltersProps,
  onResetFilters,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
          height: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 350,
            boxSizing: "border-box",
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
        <Stack direction="column" sx={{ height: "100%", mt: 7.5 }}>
          <ResourceFilters {...resourceFiltersProps} />

          <Stack direction="column" sx={{ p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onResetFilters(false)}
            >
              Reset Filters
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
