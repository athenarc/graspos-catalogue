import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import {
  useDatasets,
  useDeleteDataset,
  useDeleteResource,
  useResources,
  useUpdateDataset,
  useUpdateResource,
  useUserUsername,
} from "../queries/data";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useEffect, useState } from "react";
import { RectangularVariants } from "./Skeleton";

function ResourceGridItem({ resource, type }) {
  const ownerUsername = useUserUsername(resource?.owner);
  const deleteDatasest = useDeleteDataset();
  const deleteResource = useDeleteResource();
  const updateDataset = useUpdateDataset(resource._id);
  const updateResource = useUpdateResource(resource._id);
  const [showDescription, setShowDescription] = useState(false);

  let query = null;

  function handleDelete(id) {
    if (type === "Resource") {
      query = deleteResource;
    } else {
      query = deleteDatasest;
    }
    query.mutate(
      { id },
      {
        onSuccess: (data) => {},
        onError: (e) => {},
      }
    );
  }
  function handleUpdate(approved) {
    if (type === "Resource") {
      query = updateResource;
    } else {
      query = updateDataset;
    }
    query.mutate(
      { approved },
      {
        onSuccess: (data) => {},
        onError: (e) => {},
      }
    );
  }
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
        alignItems="center"
        sx={{ backgroundColor: "white", pb: 0 }}
      >
        <Stack direction={"row"} justifyContent="center" spacing={1}>
          <Typography variant="h6">{resource?.name}</Typography>
          {resource?.approved ? (
            <Tooltip title="Resource has been approved by an Admin">
              <CheckCircleIcon color="success" fontSize="small" />
            </Tooltip>
          ) : (
            <Tooltip title="Resource is pending approval by an Admin">
              <PendingActionsIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
        </Stack>

        <CardContent
          component={Stack}
          direction={"row"}
          spacing={0}
          sx={{ p: "0!important" }}
        >
          {!resource.approved ? (
            <>
              <Tooltip title={"Approve " + String(type)}>
                <IconButton
                  color="success"
                  onClick={() => {
                    handleUpdate(true);
                  }}
                >
                  <Check fontSize="" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  "Reject " +
                  String(type) +
                  ". " +
                  String(type) +
                  " will be deleted"
                }
              >
                <IconButton
                  color="error"
                  onClick={() => {
                    handleUpdate(false);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title={"Edit " + String(type)}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Delete " + String(type)}>
                <IconButton
                  color="error"
                  onClick={() => {
                    handleDelete(resource._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </CardContent>
      </CardContent>

      <CardContent
        component={Stack}
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{
          py: 1,
          pb: 0,
          backgroundColor: "white",
          borderBottom: "1px solid grey",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
          More Information
        </Typography>
        <IconButton
          onClick={() => {
            setShowDescription(!showDescription);
          }}
        >
          {showDescription && <KeyboardArrowUpIcon />}
          {!showDescription && <KeyboardArrowDownIcon />}
        </IconButton>
      </CardContent>
      {showDescription && (
        <CardContent
          sx={{
            backgroundColor: "beige",
            p: 2,
            height: "50px",
            overflow: "auto",
          }}
        >
          {resource?.description}
        </CardContent>
      )}
      <CardContent
        component={Stack}
        direction={"row"}
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "white", pt: 3 }}
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
          height: "22px",
        }}
      >
        {type.toUpperCase()}
      </CardContent>
    </Grid>
  );
}

function ResourcesFilterBar({ resourceFilter, handleResourceFilterChange }) {
  return (
    <Stack sx={{ width: "100%", backgroundColor: "#f0fcfb", p: 1 }}>
      <Grid size={12} sx={{ margin: "auto", textAlign: "left" }}>
        <TextField
          slotProps={{
            input: {
              style: {
                borderRadius: "19px",
                backgroundColor: "#fff",
              },
            },
          }}
          placeholder="Search Resource.."
          size="small"
          value={resourceFilter}
          onChange={(e) => handleResourceFilterChange(e.target.value)}
        />
      </Grid>
    </Stack>
  );
}

export default function ResourcesGrid() {
  const datasets = useDatasets();
  const resources = useResources();
  const [resourceFilter, setResourceFilter] = useState("");
  const [filteredResources, setFilteredResources] = useState(
    resources?.data?.data ?? []
  );
  const [filteredDatasets, setFilteredDatasets] = useState(
    datasets?.data?.data ?? []
  );

  useEffect(() => {
    setFilteredResources(resources?.data?.data);
    setFilteredDatasets(datasets?.data?.data);
  }, [datasets?.data?.data, resources?.data?.data]);

  function handleResourceFilterChange(value) {
    setResourceFilter(value);
    if (value === "") {
      setFilteredResources(resources?.data?.data);
      setFilteredDatasets(datasets?.data?.data);
    } else {
      setFilteredResources(
        resources?.data?.data?.filter((resource) =>
          resource.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredDatasets(
        datasets?.data?.data?.filter((dataset) =>
          dataset.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }
  return (
    <>
      <ResourcesFilterBar
        resourceFilter={resourceFilter}
        handleResourceFilterChange={handleResourceFilterChange}
      />

      <Grid container spacing={3} m={3} alignItems="start">
        {datasets.isLoading && <RectangularVariants count={4} />}
        {resources.isLoading && <RectangularVariants count={4} />}

        {filteredDatasets?.map((dataset) => (
          <ResourceGridItem
            key={dataset._id}
            resource={dataset}
            type={"Dataset"}
          />
        ))}
        {filteredResources?.map((resource) => (
          <ResourceGridItem
            key={resource._id}
            resource={resource}
            type={"Resource"}
          />
        ))}
      </Grid>
    </>
  );
}
