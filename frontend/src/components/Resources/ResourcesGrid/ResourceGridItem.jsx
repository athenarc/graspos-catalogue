import { Box, Grid2 as Grid, Card, CardContent } from "@mui/material";
import ResourceItemHeader from "./ResourceGridItemComponents/ResourceItemHeader";
import ResourceItemContent from "./ResourceGridItemComponents/ResourceItemContent";
import ResourceItemFooter from "./ResourceGridItemComponents/ResourceItemFooter";

export default function ResourceGridItem({ resource, type, user }) {
  const typeColors = {
    data: { bg: "#B3E5FC", color: "#01579B" },
    monitoring: { bg: "#C8E6C9", color: "#1B5E20" },
    enrichment: { bg: "#F8BBD0", color: "#880E4F" },
  };

  const { bg, color } = typeColors[resource?.service_type] || {
    bg: "#E0E0E0",
    color: "#424242",
  };
  return (
    <Grid key={resource?._id} size={{ xs: 12 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          borderRadius: "5px",
          border: "1px solid",
          borderColor: !resource?.approved ? "#FFD700" : "#e0dfdf",
          backgroundColor: !resource?.approved ? "#FFFDE7" : "#f8faff",
          boxShadow: 0,
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 4,
          },
          color: "#555",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ pb: 1, mb: 1 }}>
            <ResourceItemHeader resource={resource} type={type} user={user} />
            <ResourceItemContent resource={resource} />
          </CardContent>
          <CardContent
            sx={{
              paddingBottom: "16px !important",
              paddingTop: "0 !important",
              mt: "auto",
            }}
          >
            <ResourceItemFooter
              resource={resource}
              type={type?.toLowerCase()}
            />
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
}
