import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyEmail } from "@queries/data";
import AlertMessage from "./AlertMessage";

export default function EmailVerificationModal() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending"); // pending | success | error
  const [message, setMessage] = useState("");
  const { data: verificationData, error: verificationError } =
    useVerifyEmail(token);
  useEffect(() => {
    if (verificationData) {
      setStatus("success");
      setMessage(
        "Your email has been successfully verified. You can now log in."
      );
    }
    if (verificationError) {
      setStatus("error");
      if (verificationError.response?.data?.detail) {
        setMessage(verificationError.response.data.detail);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
  }, [verificationData, verificationError]);

  const handleClose = () => {
    navigate("..");
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#20477B",
          color: "white",
          textAlign: "center",
        }}
      >
        Email Verification
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, paddingTop: "16px !important;" }}>
        <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
          {status === "pending" && <CircularProgress />}

          {message && (
            <AlertMessage severity={status}>
              {message}
            </AlertMessage>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {status !== "pending" && (
          <Button
            variant="contained"
            onClick={() =>
              navigate(status === "success" ? "/login" : "/register")
            }
            sx={{ backgroundColor: "#20477B" }}
          >
            {status === "success" ? "Go to Login" : "Back to Register"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
