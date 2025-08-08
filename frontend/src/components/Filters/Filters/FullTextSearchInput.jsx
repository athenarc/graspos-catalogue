import { Divider, Stack, Typography, Card, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export default function TextFilter({ selectedFilters, onFilterChange }) {
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
    <Card>
      <Typography
        variant="h6"
        sx={{ pl: 1, backgroundColor: "lightblue", color: "white" }}
      >
        Keywords
      </Typography>
      <Divider />
      <Stack spacing={2} p={2}>
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Search Title, abstract.."
          fullWidth
          value={textValue}
          onChange={handleTextChange}
        />
      </Stack>
      <Divider />
    </Card>
  );
}
