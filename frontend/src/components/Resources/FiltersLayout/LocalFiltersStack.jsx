import {
  Stack,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import SortFilter from "./Filters/SortFilter";
import LicenseAutocompleteFilter from "./Filters/LicenseMultiAutocompleteFilter";
import DateFilter from "./Filters/DatePickerFilter";
import TagAutoCompleteFilter from "./Filters/TagAutocompleteFilter";
import GrasposVerifiedFilter from "./Filters/GrasposFilterSwitch";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";

export default function LocalFiltersStack({
  filters,
  selectedResource,
  handleChangeFilters,
}) {
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const handleOpenModal = () => setFiltersModalOpen(true);
  const handleCloseModal = () => setFiltersModalOpen(false);

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={2}
        sx={{
          p: 1,
          mx: 3,
          mb: 0,
          mt: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "0 !important;",
          }}
        >
          <GrasposVerifiedFilter
            selectedFilters={filters}
            onFilterChange={handleChangeFilters}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            marginLeft: "0 !important;",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleOpenModal}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minWidth: "120px",
            }}
            startIcon={<FilterAltIcon />}
          >
            More Filters
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: "0 !important;",
          }}
        >
          <SortFilter filters={filters} onFilterChange={handleChangeFilters} />
        </Box>
      </Stack>

      <Dialog
        open={filtersModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          More Filters
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap={2}>
            <DateFilter
              selectedFilters={filters}
              onFilterChange={handleChangeFilters}
            />
            <LicenseAutocompleteFilter
              selectedFilters={filters}
              selectedResource={selectedResource}
              onFilterChange={handleChangeFilters}
            />
            <TagAutoCompleteFilter
              selectedFilters={filters}
              selectedResource={selectedResource}
              onFilterChange={handleChangeFilters}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{ borderColor: "rgba(0, 0, 0, 0.1)", color: "text.secondary" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
