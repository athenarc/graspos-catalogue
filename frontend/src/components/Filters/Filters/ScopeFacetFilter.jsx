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
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { FilterVariants } from "@helpers/Skeleton";
import { useScopesWithCount } from "@queries/scope";

export default function ScopeFacetFilter({ selectedFilters, onFilterChange }) {
  const { data: scopeData, isLoading } = useScopesWithCount();
  const { data: scopeCounts } = useScopesWithCount();

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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1, backgroundColor: "lightblue", color: "white" }}
      >
        <Typography variant="h6">By SCOPE stages</Typography>
        <Tooltip
          title="SCOPE Framework for Research Evaluation | INORMS
The SCOPE framework for research evaluation is a five-stage model for evaluating responsibly. It is a practical step-by-step process designed to help research managers, or anyone involved in conducting research evaluations, in planning new evaluations as well as check existing evaluations."
        >
          <HelpOutlineIcon />
        </Tooltip>
      </Stack>

      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {isLoading ? (
          <FilterVariants count={5} />
        ) : scopeData?.data?.length > 0 ? (
          scopeData.data.map((scope) => (
            <Tooltip title={scope?.description} key={scope?._id}>
              <ListItem
                key={scope?._id}
                onClick={() => handleToggle(scope?._id)}
                sx={{ p: 0, cursor: "pointer" }}
              >
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
                  <Checkbox
                    edge="start"
                    checked={!!selectedScopes[scope?._id]}
                    tabIndex={-1}
                    disableRipple
                    sx={{ p: 1 }}
                  />
                  <ListItemText
                    primary={scope?.name}
                    sx={{ mr: 1 }}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: { fontSize: "0.875rem" },
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ flexShrink: 0, ml: 1, whiteSpace: "nowrap" }}
                    title={`Resource count: ${scope?.usage_count}`}
                  >
                    ({scope?.usage_count})
                  </Typography>
                </div>
                <Avatar
                  sx={{
                    width: 18,
                    height: 18,
                    fontSize: 12,
                    backgroundColor: scope?.bg_color ?? "#EB611F",
                  }}
                >
                  {scope?.name?.toUpperCase()[0]}
                </Avatar>
              </ListItem>
            </Tooltip>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No scopes available</Typography>
        )}
      </List>
      <Divider />
    </Card>
  );
}
