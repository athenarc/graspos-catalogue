import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Grid2 as Grid } from "@mui/material";

export function RectangularVariants({ count, height = 300 }) {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {[...Array(count)].map((e, i) => (
        <Grid key={i} size={{ xs: 10, sm: 4 }}>
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
