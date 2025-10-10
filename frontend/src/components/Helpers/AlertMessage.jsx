import { Alert } from "@mui/material";

export default function AlertMessage({ severity, children }) {
  return <Alert severity={severity}>{children}</Alert>;
}
