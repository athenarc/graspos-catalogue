import {
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Card,
  Avatar,
  Tooltip,
} from "@mui/material";

import { useScopes } from "../../../../queries/scope";
import { useEffect, useState } from "react";

export default function ScopeFacetFilter({ selectedFilters, onFilterChange }) {
  const { data: scopeData } = useScopes();
  const [selectedScopes, setSelectedScopes] = useState(
    selectedFilters?.scopes || {}
  );

  useEffect(() => {
    if (!scopeData?.data) return;

    const validSelectedScopes = Object.keys(
      selectedFilters?.scopes || {}
    ).reduce((acc, scopeId) => {
      const scopeExists = scopeData.data.some((scope) => scope._id === scopeId);
      if (scopeExists) {
        acc[scopeId] = selectedFilters.scopes[scopeId];
      }
      return acc;
    }, {});

    if (
      JSON.stringify(validSelectedScopes) !== JSON.stringify(selectedScopes)
    ) {
      setSelectedScopes(validSelectedScopes);
      onFilterChange({ scopes: validSelectedScopes });
    }
  }, [selectedFilters, scopeData, selectedScopes, onFilterChange]);

  const handleToggle = (scopeId) => {
    const updatedScopes = {
      ...selectedScopes,
      [scopeId]: !selectedScopes[scopeId],
    };
    setSelectedScopes(updatedScopes);
    onFilterChange({ scopes: updatedScopes });
  };

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{ pl: 1, backgroundColor: "lightblue", color: "white" }}
      >
        Scopes
      </Typography>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {scopeData?.data?.length > 0 ? (
          scopeData.data.map((scope) => (
            <ListItem
              key={scope._id}
              onClick={() => handleToggle(scope._id)}
              sx={{ p: 0 }}
            >
              <Checkbox
                edge="start"
                checked={!!selectedScopes[scope._id]}
                tabIndex={-1}
                disableRipple
                sx={{ p: 1 }}
              />
              <ListItemText primary={scope.name} sx={{ mr: 1 }} />
              <Tooltip title={scope.description}>
                <Avatar
                  sx={{
                    width: 18,
                    height: 18,
                    fontSize: 12,
                    backgroundColor: scope.bg_color ?? "#EB611F",
                  }}
                >
                  {scope.name?.toUpperCase()[0]}
                </Avatar>
              </Tooltip>
            </ListItem>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No scopes available</Typography>
        )}
      </List>
      <Divider />
    </Card>
  );
}
