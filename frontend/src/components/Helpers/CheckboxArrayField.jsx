import {
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Tooltip,
  Box,
} from "@mui/material";
import { renderIcon } from "@helpers/MenuItems";

export default function CheckboxArrayField({
  items,
  selectedItems,
  setSelectedItems,
  icons = false,
  colors = false,
}) {
  const handleToggle = (id) => {
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter((i) => i !== id)
      : [...selectedItems, id];
    setSelectedItems(newSelected); // ενημερώνει το state
  };

  return (
    <Grid container spacing={1}>
      {items?.map((item) => (
        <Grid size={{ xs: 12, sm: 6 }} key={item._id}>
          <Tooltip title={item.description || ""}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleToggle(item._id)}
                  sx={{
                    color: item.bg_color && colors ? item.bg_color : "#1976d2",
                  }}
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  {icons && renderIcon(item.name)}
                  <span>{item.name}</span>
                </Box>
              }
            />
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
}
