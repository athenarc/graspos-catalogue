import {
  Avatar,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import { useDatasets, useResources, useUserUsername } from "../queries/data";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useOutletContext } from "react-router-dom";

function ResourceGridItem({ resource, type }) {
  const ownerUsername = useUserUsername(resource?.owner);
  return (
    <Grid
      key={resource?._id}
      component={Card}
      size={{ xs: 12, md: 3 }}
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        backgroundColor: [type == "Dataset" ? "#FFC067" : "#2B3A57"],
      }}
    >
      <CardContent
        component={Stack}
        direction={"row"}
        justifyContent="space-between"
        sx={{ backgroundColor: "white" }}
      >
        <Typography variant="h6">{resource?.name}</Typography>

        {resource?.approved ? (
          <Avatar
            sx={{
              p: "4px",
              backgroundColor: "green",
              width: "20px",
              height: "20px",
            }}
          >
            <CheckIcon />
          </Avatar>
        ) : (
          <Avatar
            sx={{
              p: "4px",
              backgroundColor: "orange",
              width: "20px",
              height: "20px",
            }}
          >
            <PendingActionsIcon />
          </Avatar>
        )}
      </CardContent>
      <CardContent
        component={Stack}
        direction={"row"}
        spacing={1}
        justifyContent="space-between"
        sx={{ backgroundColor: "white" }}
      >
        <CardContent
          component={Stack}
          direction={"row"}
          spacing={1}
          sx={{ p: "0!important" }}
        >
          <PersonIcon />
          <Typography>{ownerUsername?.data?.data?.username}</Typography>
        </CardContent>
        <CardContent
          component={Stack}
          direction={"row"}
          spacing={1}
          sx={{ p: "0!important" }}
        >
          <CorporateFareIcon />
          <Typography>
            {resource?.organization ? resource?.organization : "N/A"}
          </Typography>
        </CardContent>
      </CardContent>
      <CardContent
        component={Typography}
        variant={"subtitle2"}
        sx={{
          p: 0.5,
          paddingBottom: "4px !important;",
          color: "white",
          textAlign: "center",
          m: "auto",
        }}
      >
        {type.toUpperCase()}
      </CardContent>
    </Grid>
  );
}

export default function ResourcesGrid() {
  const datasets = useDatasets();
  const resources = useResources();
  const { user } = useOutletContext();

  return (
    <Grid container spacing={3} m={3} sx={{ height: "auto" }}>
      {datasets?.data?.data?.map((dataset) => (
        <ResourceGridItem resource={dataset} type={"Dataset"} />
      ))}
      {resources?.data?.data?.map((resource) => (
        <ResourceGridItem resource={resource} type={"Resource"} />
      ))}
    </Grid>
  );
}
