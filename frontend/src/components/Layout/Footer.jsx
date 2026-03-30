import { Box, Typography, useMediaQuery } from "@mui/material";

export default function Footer({ hasDrawer = false }) {
  const isMobile = useMediaQuery("(max-width:1000px)");
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: isMobile ? 0 : (hasDrawer ? "400px" : 0),
        right: 0,
        textAlign: "center",
        padding: "16px 24px",
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #e0e0e0",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "0.775rem", lineHeight: 1.5 }}
      >
        This project has received funding from the European Union’s Horizon
        Europe framework programme under grant agreement No. 101095129. Views
        and opinions expressed are however those of the author(s) only and do
        not necessarily reflect those of the European Union or the European
        Research Executive Agency. Neither the European Union nor the European
        Research Executive Agency can be held responsible for them.
      </Typography>
    </Box>
  );
}
