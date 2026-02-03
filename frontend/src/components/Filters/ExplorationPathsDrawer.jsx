import { useState } from "react";
import {
  Drawer,
  Stack,
  Fab,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import ScopeFacetFilter from "./Filters/ScopeFacetFilter";
import GeographicalCoverageFacetFilter from "./Filters/GeographicalCoverageFacetFilter";
import AssessmentFacetFilter from "./Filters/AssessmentSubjectFilter";
import UniqueAutocompleteFieldFilter from "./Filters/GlobalAutocompleteFilter";

export function ExplorationPathsStack({
  selectedFilters,
  handleChangeFilters,
}) {
  return (
    <Stack direction="column" spacing={2} sx={{ flexGrow: 1, px: 2 }}>
      <ScopeFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <AssessmentFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <GeographicalCoverageFacetFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="assessment_values"
        label="Assessment Values"
        tooltip="Values that can be supported by a research assessment event using the resources."
        scope="local"
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="evidence_types"
        label="Evidence Types"
        scope="local"
        tooltip="The types of assessment evidence that the resources is offering or leveraging."
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="covered_fields"
        label="Covered Fields"
        scope="local"
        tooltip="The fields that the resources cover."
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
      <UniqueAutocompleteFieldFilter
        field="covered_research_products"
        label="Covered Research Products"
        scope="local"
        tooltip="The research products that the resources cover."
        selectedFilters={selectedFilters}
        onFilterChange={handleChangeFilters}
      />
    </Stack>
  );
}

export default function ExplorationPathsDrawer({
  isMobile,
  handleResetFilters,
  selectedFilters,
  handleChangeFilters,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };
  return (
    <>
      {isMobile && (
        <Button
          fullWidth={isMobile}
          variant="outlined"
          startIcon={<RouteIcon />}
          onClick={toggleDrawer}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Paths
        </Button>
      )}
      <Drawer
        sx={{
          
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: !isMobile ? 400 : "80%",
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
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Exploration paths
          </Typography>

          <Divider sx={{ m: 0, pb: 0 }} />
          <ExplorationPathsStack
            selectedFilters={selectedFilters}
            handleChangeFilters={handleChangeFilters}
          />
        </Stack>

        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              if (isMobile) toggleDrawer();
              handleResetFilters(false);
            }}
          >
            Reset
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
