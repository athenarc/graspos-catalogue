import { Alert } from "@mui/material";

export default function AlertMessage({ severity, children }) {
  return <Alert severity={severity} sx={{ position: "relative", p: 2 }}>{children}</Alert>;
}
