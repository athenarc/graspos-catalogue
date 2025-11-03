import { Box, Typography } from "@mui/material";

const colorMapping = {
  info: [
    { bgcolor: "#f5f5f5" },
    { borderColor: "#ccc" },
    { color: "text.secondary" },
  ],
  warning: [
    { bgcolor: "#fff3e0" },
    { borderColor: "#ffe0b2" },
    { color: "warning.main" },
  ],
  error: [
    { bgcolor: "#FFEBEE" },
    { borderColor: "#EF9A9A" },
    { color: "error.main" },
  ],
};

export default function ResourceMessage({ message, status = "info" }) {
  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: 1,
        backgroundColor: colorMapping[status][0].bgcolor,
        borderColor: colorMapping[status][1].borderColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography
        fontStyle="italic"
        sx={{ textAlign: "center" }}
        color={colorMapping[status][2].color}
      >
        {message}
      </Typography>
    </Box>
  );
}
