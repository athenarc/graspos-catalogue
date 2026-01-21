import { Box, Grid2 as Grid, IconButton, Paper } from "@mui/material";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { Dataset } from "../Datasets/Datasets";
import { Document } from "../Documents/Documents";
import { Tool } from "../Tools/Tools";
import { Service } from "../Services/Services";
import { ResourceActionsMenu } from "./ResourceGridItemComponents/ResourceItemHeader";
import { useAuth } from "../../AuthContext";

export function ResourcePageMenu() {
  return <div>Resource Page Menu</div>;
}

export function ResourcePage() {
  const { resourceUniqueSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const type = location?.pathname.includes("datasets")
    ? "Dataset"
    : location?.pathname.includes("documents")
    ? "Document"
    : location?.pathname.includes("tools")
    ? "Tool"
    : location?.pathname.includes("services")
    ? "Service"
    : "Resource";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          borderBottom: "1px solid #e0e0e0",
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          color="primary"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { backgroundColor: "primary.light", color: "#fff" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box>
          {resource && user && (
            <ResourceActionsMenu resource={resource} type={type} user={user} />
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4, lg: 6, xl: 8 },
          py: 2,
        }}
      >
        <Grid container spacing={4}>
          {location?.pathname.includes("dataset") && (
            <Dataset
              resourceUniqueSlug={resourceUniqueSlug}
              handleSetResource={setResource}
            />
          )}
          {location?.pathname.includes("documents") && (
            <Document
              resourceUniqueSlug={resourceUniqueSlug}
              handleSetResource={setResource}
            />
          )}
          {location?.pathname.includes("tools") && (
            <Tool
              resourceUniqueSlug={resourceUniqueSlug}
              handleSetResource={setResource}
            />
          )}
          {location?.pathname.includes("services") && (
            <Service
              resourceUniqueSlug={resourceUniqueSlug}
              handleSetResource={setResource}
            />
          )}
        </Grid>
      </Box>
    </Box>
  );
}
