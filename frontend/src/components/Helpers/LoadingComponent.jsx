import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingComponent({ loadingMessage = "Loading ..." }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
      sx={{
        backgroundColor: "#f9fafc",
        borderRadius: 1,
        borderWidth: 1,
        borderColor: "divider",
        borderStyle: "solid",
      }}
    >
      <CircularProgress size={64} sx={{ color: "#20477B" }} />
      <Typography variant="h6" sx={{ color: "#20477B" }}>
        {loadingMessage}
      </Typography>
    </Box>
  );
}
