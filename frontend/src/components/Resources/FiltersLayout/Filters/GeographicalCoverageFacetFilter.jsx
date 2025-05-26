import {
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Card,
  Avatar,
  TextField,
  Stack,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCountries } from "../../../../queries/countries";

export default function GeographicalCoverageFacetFilter({
  selectedFilters,
  onFilterChange,
}) {
  const { data: geoData } = useCountries();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGeo, setSelectedGeo] = useState(
    selectedFilters?.geographical_coverage || {}
  );

  useEffect(() => {
    if (!geoData?.data) return;

    const validSelectedGeo = Object.keys(
      selectedFilters?.geographical_coverage || {}
    ).reduce((acc, geoId) => {
      const geoExists = geoData.data.some((geo) => geo._id === geoId);
      if (geoExists) {
        acc[geoId] = selectedFilters.geographical_coverage[geoId];
      }
      return acc;
    }, {});

    if (JSON.stringify(validSelectedGeo) !== JSON.stringify(selectedGeo)) {
      setSelectedGeo(validSelectedGeo);
      onFilterChange({ geographical_coverage: validSelectedGeo });
    }
  }, [selectedFilters, geoData, selectedGeo, onFilterChange]);

  const handleToggle = (geoId) => {
    const updatedGeo = {
      ...selectedGeo,
      [geoId]: !selectedGeo[geoId],
    };
    setSelectedGeo(updatedGeo);
    onFilterChange({ geographical_coverage: updatedGeo });
  };

  const filteredGeo = geoData?.data?.filter((geo) =>
    geo.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      />
      <CardContent
        sx={{
          p: 2,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <List>
          {filteredGeo?.length > 0 ? (
            filteredGeo.map((geo) => (
              <ListItem
                key={geo._id}
                onClick={() => handleToggle(geo._id)}
                sx={{ p: 0 }}
              >
                <Checkbox
                  edge="start"
                  checked={!!selectedGeo[geo._id]}
                  tabIndex={-1}
                  disableRipple
                  sx={{ p: 1 }}
                />
                <ListItemText primary={geo.label} sx={{ mr: 1 }} />
                <Avatar
                  src={geo.flag}
                  alt={geo.label}
                  sx={{ width: 18, height: 18 }}
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ p: 2 }}>No countries available</Typography>
          )}
        </List>
      </CardContent>

      <Divider />
    </Card>
  );
}
