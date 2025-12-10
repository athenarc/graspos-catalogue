import {
  Stack,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
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

export default function LocalFiltersStack({
  filters,
  selectedResource,
  handleChangeFilters,
}) {
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={2}
        sx={{ p: 1, mx: 3, mt: 1, mb: 0 }}
      >
        <Box flex={1} display="flex" justifyContent="flex-start">
          <GrasposVerifiedFilter
            selectedFilters={filters}
            onFilterChange={handleChangeFilters}
          />
        </Box>

        <Box flex={1} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={() => setFiltersModalOpen(true)}
            sx={{ textTransform: "none", borderRadius: 2, minWidth: 140 }}
          >
            Filters
          </Button>
        </Box>

        <Box flex={1} display="flex" justifyContent="flex-end">
          {selectedResource !== 3 && (
            <SortFilter
              filters={filters}
              onFilterChange={handleChangeFilters}
              selectedResource={selectedResource}
            />
          )}
        </Box>
      </Stack>

      <Dialog
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        fullWidth
        maxWidth={selectedResource !== 3 ? "md" : "sm"}
        scroll="paper"
      >
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            textAlign: "center",
            position: "relative",
            py: 1.5,
          }}
        >
          Filters
          <IconButton
            aria-label="close"
            onClick={() => setFiltersModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="stretch"
            >
              {selectedResource !== 3 && (
                <Box flex={1}>
                  <DateFilter
                    selectedFilters={filters}
                    onFilterChange={handleChangeFilters}
                  />
                </Box>
              )}

              {selectedResource !== 3 && (
                <Divider orientation="vertical" flexItem />
              )}

              <Box flex={1} display="flex" flexDirection="column" gap={2}>
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
              </Box>
            </Stack>

            {(selectedResource === 1 || selectedResource === 3) && (
              <Stack direction="column" spacing={2}>
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
              </Stack>
            )}

            {(selectedResource === 0 ||
              selectedResource === 1 ||
              selectedResource === 2) && (
              <Stack direction="column" spacing={2}>
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
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8f9fa" }}>
          <Button
            variant="outlined"
            onClick={() => setFiltersModalOpen(false)}
            sx={{ borderColor: "rgba(0,0,0,0.1)", color: "text.secondary" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
