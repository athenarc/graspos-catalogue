import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

export default function ConfirmationModal(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmRequest = () => {
    props.response();
    handleClose();
  };

  return (
    <>
      {props.children(handleClickOpen)}
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          component="form"
          noValidate
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#20477B",
              color: "white",
              textAlign: "center",
            }}
          >
            {props?.title}
          </DialogTitle>
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
          <DialogContent sx={{ p: 2 }}>
            <DialogContentText>
              Are you sure you want to delete <b>{props?.resource?.zenodo_metadata?.title}</b>?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="error" onClick={confirmRequest}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
