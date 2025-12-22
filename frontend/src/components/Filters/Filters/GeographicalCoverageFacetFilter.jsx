import { useMemo, useState } from "react";

import {
  Divider,
  Typography,
  ListItem,
  ListItemText,
  Checkbox,
  Card,
  Avatar,
  TextField,
  Stack,
  CardContent,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";

import { useCountriesWithCount } from "@queries/countries";
import { FixedSizeList } from "react-window";
import ClearIcon from "@mui/icons-material/Clear";
import { FilterVariants } from "@helpers/Skeleton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function GeographicalCoverageFacetFilter({
  selectedFilters,
  onFilterChange,
}) {
  const { data: geoData, isLoading } = useCountriesWithCount();
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (geoId) => {
    const currentSelection = selectedFilters?.geographical_coverage || {};
    const updatedSelection = {
      ...currentSelection,
      [geoId]: !currentSelection[geoId],
    };
    onFilterChange({ geographical_coverage: updatedSelection });
  };

  const filteredGeo = useMemo(() => {
    return (
      geoData?.data?.filter((geo) =>
        geo.label.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [geoData, searchTerm]);

  const Row = ({ index, style }) => {
    const geo = filteredGeo[index];
    return (
      <ListItem
        key={geo?.id}
        style={style}
        sx={{
          p: 0,
          m: 0,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        disableGutters
        onClick={() => handleToggle(geo?.id)}
      >
        <Checkbox
          edge="start"
          checked={!!selectedFilters?.geographical_coverage?.[geo?.id]}
          disableRipple
          onChange={() => handleToggle(geo?.id)}
          sx={{ pr: 0.5 }}
        />

        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: 0,
            marginRight: 8,
          }}
        >
          <ListItemText
            primary={geo?.label}
            primaryTypographyProps={{
              noWrap: true,
              title: geo?.label,
              sx: { fontSize: "0.875rem" },
            }}
            sx={{ m: 0 }}
          />
          <Typography
            variant="body2"
            sx={{ flexShrink: 0, ml: 1, whiteSpace: "nowrap" }}
            title={`Resource count: ${geo?.resource_count}`}
          >
            ({geo?.resource_count})
          </Typography>
        </div>

        <Avatar
          src={geo?.flag}
          alt={geo?.label}
          sx={{ width: 18, height: 18, fontSize: 12 }}
        >
          {geo?.label == "WorldWide" ? "WW" : geo?.label?.toUpperCase()[0]}
        </Avatar>
      </ListItem>
    );
  };

  return (
    <Card>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1, backgroundColor: "lightblue", color: "white" }}
      >
        <Typography variant="h6">By geographical coverage</Typography>
        <Tooltip title="Geographical areas that the resources cover.">
          <HelpOutlineIcon />
        </Tooltip>
      </Stack>

      <Divider />

      <TextField
        placeholder="Search countries..."
        variant="outlined"
        size="small"
        sx={{ p: 2, pb: 0 }}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        InputProps={{
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearchTerm("")} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <CardContent sx={{ p: 2, maxHeight: 200, overflow: "hidden" }}>
        {isLoading ? (
          <FilterVariants count={5} displayExtraVariant />
        ) : filteredGeo.length > 0 ? (
          <FixedSizeList
            height={160}
            width="100%"
            itemSize={40}
            itemCount={filteredGeo.length}
          >
            {Row}
          </FixedSizeList>
        ) : (
          <Typography sx={{ p: 2 }}>No countries available</Typography>
        )}
      </CardContent>

      <Divider />
    </Card>
  );
}
