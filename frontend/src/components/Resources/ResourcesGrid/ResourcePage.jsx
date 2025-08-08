import { Box, Button, Grid2 as Grid, Stack } from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { Dataset } from "../Datasets/Datasets";
import { Document } from "../Documents/Documents";
import { Tool } from "../Tools/Tools";
import { Service } from "../Services/Services";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export function ResourcePage() {
  const { resourceId } = useParams();
  const location = useLocation();

  return (
    <Box
      sx={{
        height: "calc(100vh - 112px)",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, md: 4, lg: 6, xl: 8 },
        py: 2,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: { sm: "700px", md: "1000px", lg: "1400px", xl: "1600px" },
        }}
      >
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to={-1}
          startIcon={<ArrowBackIcon />}
          sx={{ width: "fit-content", backgroundColor: "#fff" }}
        >
          Back
        </Button>
        <Grid
          container
          spacing={4}
          sx={{
            minHeight: "100%",
          }}
        >
          {location.pathname.includes("dataset") && (
            <Dataset resourceId={resourceId} />
          )}
          {location.pathname.includes("documents") && (
            <Document resourceId={resourceId} />
          )}
          {location.pathname.includes("tools") && (
            <Tool resourceId={resourceId} />
          )}
          {location.pathname.includes("services") && (
            <Service resourceId={resourceId} />
          )}
        </Grid>
      </Stack>
    </Box>
  );
}
