import { Box, Typography, useMediaQuery } from "@mui/material";
import euFlagColor from "@assets/european-union-color.png";
import eoscSupport from "@assets/eosc-support.webp";

export default function Footer({ hasDrawer = false }) {
  const isMobile = useMediaQuery("(max-width:1000px)");
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: isMobile ? 0 : hasDrawer ? "400px" : 0,
        right: 0,
        padding: { xs: "12px 16px", sm: "16px 24px" },
        backgroundColor: "#fafafa",
        borderTop: "1px solid #e0e0e0",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: { xs: 1, sm: 2 },
      }}
    >
      {/* Logos Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={euFlagColor}
          alt="European Union Flag"
          sx={{
            height: { xs: "26px", sm: "30px" },
            width: "auto",
            opacity: 0.85,
          }}
        />
        <Box
          component="img"
          src={eoscSupport}
          alt="EOSC Support"
          sx={{
            height: { xs: "26px", sm: "30px" },
            width: "auto",
            opacity: 0.85,
          }}
        />
      </Box>

      {/* Text Section */}
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.65rem", sm: "0.7rem" },
          lineHeight: 1.5,
          color: "text.secondary",
          fontWeight: 400,
          flex: 1,
          minWidth: { xs: "100%", sm: "400px" },
          textAlign: { xs: "center", sm: "left" },
          order: { xs: 2, sm: 0 },
        }}
      >
        This project has received funding from the European Union's Horizon
        Europe framework programme under grant agreement No. 101095129. Views
        and opinions expressed are however those of the author(s) only and do
        not necessarily reflect those of the European Union or the European
        Research Executive Agency. Neither the European Union nor the European
        Research Executive Agency can be held responsible for them.
      </Typography>
    </Box>
  );
}
