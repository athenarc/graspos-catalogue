import { Stack, Switch, FormControlLabel, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function GrasposVerifiedFilter({
  selectedFilters,
  onFilterChange,
}) {
  const handleSwitch = (event) => {
    onFilterChange({ graspos: event.target.checked });
  };

  return (
    <Stack direction="row" justifyContent="start" alignItems="center">
      <FormControlLabel
        control={
          <Switch
            checked={!!selectedFilters.graspos}
            onChange={handleSwitch}
            color="primary"
          />
        }
        label="Funded by GraspOS"
        sx={{ mr: 1 }}
      />
      <Tooltip title="By toggling on, resources that are funded by GraspOS project will be displayed.">
        <InfoOutlinedIcon fontSize="small" />
      </Tooltip>
    </Stack>
  );
}
