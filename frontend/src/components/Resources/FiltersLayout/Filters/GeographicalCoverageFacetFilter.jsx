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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useCountriesWithCount } from "../../../../queries/countries";
import { FixedSizeList } from "react-window";
import ClearIcon from "@mui/icons-material/Clear";

export default function GeographicalCoverageFacetFilter({
  selectedFilters,
  onFilterChange,
}) {
  const { data: geoData } = useCountriesWithCount();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGeo, setSelectedGeo] = useState(
    selectedFilters?.geographical_coverage || {}
  );

  useEffect(() => {
    if (!geoData?.data) return;

    const validSelectedGeo = Object.keys(
      selectedFilters?.geographical_coverage || {}
    ).reduce((acc, geoId) => {
      const geoExists = geoData.data.some((geo) => geo.id === geoId);
      if (geoExists) {
        acc[geoId] = selectedFilters.geographical_coverage[geoId];
      }
      return acc;
    }, {});

    setSelectedGeo(validSelectedGeo);
  }, [selectedFilters, geoData]);

  const handleToggle = (geoId) => {
    const updatedGeo = {
      ...selectedGeo,
      [geoId]: !selectedGeo[geoId],
    };
    setSelectedGeo(updatedGeo);
    onFilterChange({ geographical_coverage: updatedGeo });
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
        sx={{ p: 0 }}
        disableGutters
        onClick={() => handleToggle(geo?.id)}
      >
        <Checkbox
          edge="start"
          checked={!!selectedGeo[geo?.id]}
          tabIndex={-1}
          disableRipple
          onChange={() => handleToggle(geo?.id)}
          sx={{ p: 1, pl: 1.1 }}
        />
        <ListItemText
          primary={geo?.label + " (" + geo?.resource_count + ")"}
          sx={{
            mr: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={geo?.label}
        />
        <Avatar
          src={geo?.flag}
          alt={geo?.label}
          sx={{ width: 18, height: 18, flexShrink: 0 }}
        />
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
        {filteredGeo.length > 0 ? (
          <FixedSizeList
            height={160}
            width="100%"
            itemSize={48}
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
