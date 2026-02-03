import {
  Stack,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";

import SortFilter from "./Filters/SortFilter";
import LicenseAutocompleteFilter from "./Filters/LicenseMultiAutocompleteFilter";
import DateFilter from "./Filters/DatePickerFilter";
import TagAutoCompleteFilter from "./Filters/TagAutocompleteFilter";
import GrasposVerifiedFilter from "./Filters/GrasposFilterSwitch";
import TrlFilter from "./Filters/TrlFilter";
import AssessmentFunctionalitiesFilter from "./Filters/AssessmentFunctionalitiesFilter";
import LanguageAutocompleteFilter from "./Filters/LanguageFilter";
import AccessRightFilter from "./Filters/AccessRightFilter";
import ExplorationPathsDrawer from "./ExplorationPathsDrawer";

export default function LocalFiltersStack({
  filters,
  selectedResource,
  handleChangeFilters,
  isMobile,
  handleResetFilters,
}) {
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const activeFiltersCount = 0;
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ p: 1, mx: 3, mt: 1, mb: 0 }}
      >
        <Box flex={isMobile ? 0 : 1} display="flex" justifyContent="flex-start">
          {!isMobile && (
            <GrasposVerifiedFilter
              selectedFilters={filters}
              onFilterChange={handleChangeFilters}
            />
          )}
        </Box>
        <Box
          flex={isMobile ? 1 : 0}
          display="flex"
          justifyContent="space-between"
          sx={{ gap: isMobile ? 2 : 0, m: "0px !important;" }}
        >
          <ExplorationPathsDrawer
            isMobile={isMobile}
            handleResetFilters={handleResetFilters}
            selectedFilters={filters}
            handleChangeFilters={handleChangeFilters}
          />
          <Button
            fullWidth={isMobile}
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={() => setFiltersModalOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Filters
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Button>
        </Box>
        <Box flex={isMobile ? 0 : 1} display="flex" justifyContent="flex-end">
          {!isMobile && selectedResource !== 3 && (
            <SortFilter
              filters={filters}
              onFilterChange={handleChangeFilters}
              selectedResource={selectedResource}
            />
          )}
        </Box>
      </Stack>

      {/* ---------- FILTERS MODAL ---------- */}
      <Dialog
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth={isMobile ? false : "md"}
        scroll="paper"
      >
        {/* ----- HEADER ----- */}
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 10,
            py: 1.5,
          }}
        >
          Filters
          <IconButton
            onClick={() => setFiltersModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* ----- CONTENT ----- */}
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* VERIFIED BY GRASPOS */}
            {isMobile && (
              <>
                <Box>
                  <GrasposVerifiedFilter
                    selectedFilters={filters}
                    onFilterChange={handleChangeFilters}
                  />
                </Box>
                <Divider />
              </>
            )}

            {/* SORT FIRST ON MOBILE */}
            {isMobile && selectedResource !== 3 && (
              <SortFilter
                filters={filters}
                onFilterChange={handleChangeFilters}
                selectedResource={selectedResource}
              />
            )}

            {selectedResource !== 3 && (
              <DateFilter
                selectedFilters={filters}
                onFilterChange={handleChangeFilters}
              />
            )}

            {selectedResource !== 3 && (
              <LicenseAutocompleteFilter
                selectedFilters={filters}
                selectedResource={selectedResource}
                onFilterChange={handleChangeFilters}
              />
            )}

            <TagAutoCompleteFilter
              selectedFilters={filters}
              selectedResource={selectedResource}
              onFilterChange={handleChangeFilters}
            />

            {(selectedResource === 1 || selectedResource === 3) && (
              <>
                <AssessmentFunctionalitiesFilter
                  selectedFilters={filters}
                  selectedResource={selectedResource}
                  onFilterChange={handleChangeFilters}
                />
                <TrlFilter
                  selectedFilters={filters}
                  selectedResource={selectedResource}
                  onFilterChange={handleChangeFilters}
                />
              </>
            )}

            {(selectedResource === 0 ||
              selectedResource === 1 ||
              selectedResource === 2) && (
              <>
                <LanguageAutocompleteFilter
                  fieldToSearch="mapped_language"
                  field="language"
                  scope="zenodo"
                  selectedFilters={filters}
                  onFilterChange={handleChangeFilters}
                  selectedResource={selectedResource}
                />
                <AccessRightFilter
                  fieldToSearch="access_right"
                  field="access_right"
                  scope="zenodo"
                  selectedFilters={filters}
                  onFilterChange={handleChangeFilters}
                  selectedResource={selectedResource}
                />
              </>
            )}
          </Stack>
        </DialogContent>

        {/* ----- FOOTER ----- */}
        <DialogActions
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: "#fff",
            px: 2,
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setFiltersModalOpen(false)}
          >
            Apply filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
