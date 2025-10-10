import { Box, Typography } from "@mui/material";

export default function MessageBox({ message, status = "error" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "#FFEBEE",
        border: "1px solid #EF9A9A",
        borderRadius: 1,
        p: 2,
        mt: 2,
      }}
    >
      <Typography color={status} fontWeight={500}>
        {message}
      </Typography>
    </Box>
  );
}
