import { Stack, Card, Switch, FormControlLabel, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function GrasposVerifiedFilter({
  selectedFilters,
  onFilterChange,
}) {
  const handleSwitch = (event) => {
    onFilterChange({ graspos: event.target.checked });
  };

  return (
    <Card>
      <Stack direction="row" justifyContent="start" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={!!selectedFilters.graspos}
              onChange={handleSwitch}
              color="primary"
            />
          }
          label="GraspOS Verified"
          sx={{ p: 2, mr: 0 }}
        />
        <Tooltip title="By toggling on resources that are only part of GraspOS communities will be displayed">
          <InfoOutlinedIcon fontSize="small" />
        </Tooltip>
      </Stack>
    </Card>
  );
}
