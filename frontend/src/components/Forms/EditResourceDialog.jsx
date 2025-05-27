import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  FormGroup,
  Card,
  CardContent,
  Checkbox,
  Box,
  Grid2 as Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "../Notification";

export default function EditResourceDialog({
  open,
  onClose,
  scopesQuery,
  selectedScopes,
  onToggleScope,
  mutation,
  onSave,
}) {
  const { isLoading, isSuccess, isError, error, reset, isPending } = mutation;

  // Prepare notification message
  let message = "";
  if (isSuccess) message = "Scopes updated successfully!";
  if (isError) message = error?.message || "Failed to update scopes.";

  // Auto-close dialog after success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset(); // reset mutation state for next use
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, reset]);

  // Reset mutation state on close
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Edit Scopes
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
        <Divider />
        <DialogContent dividers>
          {!scopesQuery.isLoading && scopesQuery.data ? (
            <FormGroup>
              <Grid container spacing={2}>
                {scopesQuery.data.data.map((scope) => (
                  <Grid item xs={12} sm={6} md={4} key={scope._id}>
                    <Card
                      variant="outlined"
                      sx={{ borderColor: scope.bg_color ?? "#1976d2" }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="start"
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {scope.name}
                          </Typography>
                          <Checkbox
                            checked={selectedScopes.includes(scope._id)}
                            onChange={() => onToggleScope(scope._id)}
                            sx={{ color: scope.bg_color ?? "#1976d2", p: 0 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {scope.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          ) : (
            <Typography>Loading scopes...</Typography>
          )}
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
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            variant="contained"
            loading={isPending}
            loadingPosition="end"
            disabled={isPending}
            endIcon={<SaveIcon />}
            sx={{ backgroundColor: "#20477B" }}
          >
            {isPending ? "Saving" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      {(isSuccess || isError) && (
        <Notification
          requestStatus={isSuccess ? "success" : "error"}
          message={message}
        />
      )}
    </>
  );
}
