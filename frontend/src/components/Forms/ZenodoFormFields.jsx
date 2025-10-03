import { Stack } from "@mui/material";

export default function ZenodoFormFields({ form, zenodo = null }) {
  return (
    <Stack direction="row" gap={2} sx={{ mt: 2 }}>
      <Stack direction="column" sx={{ flex: 1 }}></Stack>
      <Stack direction="column" sx={{ flex: 1 }}></Stack>
    </Stack>
  );
}
