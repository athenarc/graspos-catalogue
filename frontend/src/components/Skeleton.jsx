import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Grid2 as Grid } from "@mui/material";

export function RectangularVariants({ count, width = 480, height = 300 }) {
  return [...Array(count)].map((e, i) => (
    <Grid key={i}>
      <Skeleton
        key={i}
        variant="rounded"
        animation="wave"
        width={width}
        height={height}
        sx={{ borderRadius: "10px", opacity: "1" }}
      />
    </Grid>
  ));
}

export function CircularVariants({ count, width = 30, height = 30 }) {
  return [...Array(count)].map((e, i) => (
    <Skeleton variant="circular" width={width} height={height} />
  ));
}
