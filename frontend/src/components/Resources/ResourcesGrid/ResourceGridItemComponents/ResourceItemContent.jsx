import { Grid2 as Grid, Typography, Stack, Tooltip, Chip } from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { stripHtml } from "../../../../utils/utils";
import { useEffect } from "react";

export function ResourceItemKeywords({ resource }) {
  const keywords =
    resource?.zenodo?.metadata?.keywords ||
    resource?.openaire?.metadata?.tags ||
    [];

  return (
    <Stack direction="column" justifyContent="center">
      {keywords.length > 0 ? (
        <Grid container spacing={1}>
          {keywords.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontStyle: "italic" }}
        >
          No tags available
        </Typography>
      )}
    </Stack>
  );
}

export default function ResourceItemContent({ resource }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.BASE_URL + "embed.js"; // πάντα από root, public folder
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const description =
    resource?.zenodo?.metadata?.description ||
    resource?.openaire?.metadata?.description ||
    "No description available";
  return (
    <>
      <Stack direction={"row"} spacing={2} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical",
          }}
        >
          {stripHtml(description)}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ pt: 0, pb: 1.5 }}
        alignItems="center"
      >
        <Tooltip title="Tags">
          <LocalOfferIcon fontSize="small" />
        </Tooltip>
        <ResourceItemKeywords resource={resource} />
      </Stack>
      <Stack>
        <span
          className="bip-embed"
          data-badge-type="doughnut"
          data-doi="10.1109/34.895972"
        ></span>
      </Stack>
    </>
  );
}
