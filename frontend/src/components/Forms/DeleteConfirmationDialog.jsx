import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Notification from "@helpers/Notification";

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  type = "item",
  mutation,
  resource,
}) {
  const {
    isLoading = false,
    isSuccess = false,
    isError = false,
    error,
    reset,
    isPending,
  } = mutation || {};

  const message = isSuccess
    ? `${type} deleted successfully.`
    : isError
    ? error?.message || `Failed to delete the ${type.toLowerCase()}.`
    : "";

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset?.();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, reset]);

  const handleClose = () => {
    reset?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.(resource);
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
          Confirm Deletion
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

        <DialogContent sx={{ px: 4, pt: 4, pb: 2 }}>
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Are you absolutely sure?
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.6 }}
            >
              This action will <strong>permanently delete</strong> the{" "}
              <strong>{type.toLowerCase()}</strong>. You can’t undo this and the
              data will be lost forever.
            </Typography>

            {resource?.zenodo?.title && (
              <Box
                sx={{
                  bgcolor: "#F5F5F5",
                  borderLeft: "4px solid #20477B",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontStyle: "italic" }}
                >
                  <strong>Title:</strong> {resource.zenodo.title}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#FFEBEE",
                border: "1px solid #EF9A9A",
                borderRadius: 1,
                p: 2,
              }}
            >
              <DeleteIcon color="error" />
              <Typography color="error" fontWeight={500}>
                This operation is irreversible.
              </Typography>
            </Box>
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
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={isPending}
            loading={isPending}
            loadingPosition="end"
            endIcon={<DeleteIcon />}
            sx={{ backgroundColor: "#B71C1C", color: "white" }}
          >
            {isPending ? "Deleting" : "Delete"}
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
