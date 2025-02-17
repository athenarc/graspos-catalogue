import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export default function Notification({ message, requestStatus = "success" }) {
  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={requestStatus}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
