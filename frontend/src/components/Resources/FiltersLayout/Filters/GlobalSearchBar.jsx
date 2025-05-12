import { Grid2 as Grid, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
export default function GlobalSearchBar({
  selectedFilters,

  onFilterChange,
}) {
  const [textValue, setTextValue] = useState(selectedFilters?.text || "");

  // Update state if selectedFilters.text changes externally
  useEffect(() => {
    setTextValue(selectedFilters?.text || "");
  }, [selectedFilters?.text]);

  // Handle input changes and trigger filter updates if value changed
  const handleTextChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      setTextValue(newValue);

      if (newValue !== selectedFilters?.text) {
        onFilterChange({
          text: newValue,
        });
      }
    },
    [selectedFilters?.text, onFilterChange]
  );
  return (
    <Stack sx={{ p: 2, width: "100%" }}>
      <Grid sx={{ margin: "auto" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          variant="outlined"
          placeholder="Search Resources..."
          fullWidth
          value={textValue}
          onChange={handleTextChange}
          sx={{
            width: {
              xs: "100%",
              sm: "400px",
              md: "500px",
            },
          }}
        />
      </Grid>
    </Stack>
  );
}
