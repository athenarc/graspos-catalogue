import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Grid2 as Grid, ListItem } from "@mui/material";

export function RectangularVariants({ count, height = 300 }) {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {[...Array(count)].map((e, i) => (
        <Grid key={i} size={{ xs: 12 }}>
          <Skeleton
            key={i}
            variant="rounded"
            animation="wave"
            height={height}
            sx={{ borderRadius: "10px", opacity: "1" }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export function CircularVariants({ count, width = 30, height = 30 }) {
  return [...Array(count)].map((e, i) => (
    <Skeleton variant="circular" width={width} height={height} />
  ));
}

export function FilterVariants({ count = 5, displayExtraVariant = false }) {
  return Array.from({ length: count }).map((_, i) => (
    <ListItem
      key={i}
      sx={{ p: 0, display: "flex", alignItems: "center", mb: 1 }}
    >
      <Skeleton variant="square" width={18} height={18} sx={{ mr: 2 }} />
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
        <Skeleton variant="text" width="80%" height={24} />
        {displayExtraVariant && (
          <Skeleton variant="text" width="10%" height={24} sx={{ mx: 1 }} />
        )}
        <Skeleton variant="circular" width={18} height={18} />
      </div>
    </ListItem>
  ));
}
