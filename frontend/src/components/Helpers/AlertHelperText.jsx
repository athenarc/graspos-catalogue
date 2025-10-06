import { Alert, FormHelperText } from "@mui/material";

export default function AlertHelperText({ error }) {
  return (
    <FormHelperText sx={{ mt: 2, px: 0 }}>
      <Alert severity="error" sx={{ p: "4px 8px", fontSize: "0.85rem" }}>
        {error?.message}
      </Alert>
    </FormHelperText>
  );
}
