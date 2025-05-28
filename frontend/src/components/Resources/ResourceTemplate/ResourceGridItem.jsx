import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Grid2,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  AvatarGroup,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useDeleteDataset, useUpdateDataset } from "../../../queries/dataset";
import {
  useDeleteDocument,
  useUpdateDocument,
} from "../../../queries/document";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteTool, useUpdateTool } from "../../../queries/tool";

import VerifiedIcon from "@mui/icons-material/Verified";

import { useUpdateZenodo } from "../../../queries/zenodo";

import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import { useScopes } from "../../../queries/scope";

import EditResourceDialog from "../../Forms/EditResourceDialog";
import DeleteConfirmationDialog from "../../Forms/DeleteConfirmationDialog";
import { useDeleteService, useUpdateService } from "../../../queries/service";
import { useCountries } from "../../../queries/countries";
import { useAssessments } from "../../../queries/assessment";
import { formatDate, stripHtml } from "../../utils";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FlagIcon from "@mui/icons-material/Flag";

export function ResourceItemKeywords({ resource }) {
  const keywords = resource?.zenodo?.metadata?.keywords || [];

  return (
    <Stack direction="column" justifyContent="center">
      {keywords.length > 0 ? (
        <Grid2 container spacing={1}>
          {keywords.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Grid2>
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

function ResourceItemCommunities({ resource }) {
  return resource?.zenodo?.metadata?.communities?.map(
    (community) =>
      community.id.includes("graspos") && (
        <Tooltip
          key={community.id}
          title={
            "Verified GraspOS " +
            community.id.replace("graspos-", "").replace(/s$/, "")
          }
        >
          <VerifiedIcon
            color="primary"
            sx={{
              fontSize: "1.2rem",
              verticalAlign: "middle",
              ml: 1,
            }}
          />
        </Tooltip>
      )
  );
}
export function ResourceActionsMenu({ resource, type, user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editScopesOpen, setEditScopesOpen] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [queryState, setQueryState] = useState(false);

  const scopesQuery = useScopes();
  const countriesQuery = useCountries();
  const assessmentsQuery = useAssessments();
  const updateZenodo = useUpdateZenodo();

  const updateDocument = useUpdateDocument(resource?._id);
  const updateDataset = useUpdateDataset(resource?._id);
  const updateTool = useUpdateTool(resource?._id);
  const updateService = useUpdateService(resource?._id);

  const deleteDocument = useDeleteDocument();
  const deleteDataset = useDeleteDataset();
  const deleteTool = useDeleteTool();
  const deleteService = useDeleteService();

  const deleteMutation =
    type === "Document"
      ? deleteDocument
      : type === "Dataset"
      ? deleteDataset
      : type === "Tool"
      ? deleteTool
      : deleteService;

  const updateQuery =
    type === "Document"
      ? updateDocument
      : type === "Dataset"
      ? updateDataset
      : type === "Tool"
      ? updateTool
      : updateService;

  useEffect(() => {
    if (resource?.scopes) {
      setSelectedScopes(resource?.scopes.map((s) => s._id || s.id));
    }
  }, [resource]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleUpdate = (approved) => {
    setQueryState(true);
    updateQuery.mutate(
      { approved },
      {
        onSuccess: () => {
          setQueryState(false);
          handleClose();
        },
        onError: () => {
          setQueryState(false);
          handleClose();
        },
      }
    );
  };

  const handleUpdateZenodo = (data) => {
    updateZenodo.mutate(data, {
      onSuccess: () => handleClose(),
      onError: () => handleClose(),
    });
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
    handleClose();
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate({ id: resource?._id });
  };

  const handleOpenEditScopes = () => {
    setEditScopesOpen(true);
    handleClose();
  };

  const handleCloseEditScopes = () => setEditScopesOpen(false);

  const handleToggleScope = (scopeId) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleSaveScopes = (updatedValues) => {
    updateQuery.mutate(updatedValues);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {!resource?.approved && user?.super_user ? (
          <>
            <MenuItem onClick={() => handleUpdate(true)} disabled={queryState}>
              <ListItemIcon>
                <Check fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Approve {type.toLowerCase()}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleUpdate(false)} disabled={queryState}>
              <ListItemIcon>
                <ClearIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reject {type.toLowerCase()}</ListItemText>
            </MenuItem>
          </>
        ) : (
          user && (
            <>
              <Tooltip
                title={
                  !user.super_user && resource?.owner !== user.id
                    ? "You don't have permission"
                    : ""
                }
              >
                <span>
                  <MenuItem
                    onClick={handleOpenEditScopes}
                    disabled={
                      !user ||
                      updateZenodo.isPending ||
                      (!user.super_user && resource?.owner !== user.id)
                    }
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                </span>
              </Tooltip>

              <Tooltip
                title={
                  !user.super_user && resource?.owner !== user.id
                    ? "You don't have permission"
                    : ""
                }
              >
                <span>
                  <MenuItem
                    onClick={() =>
                      handleUpdateZenodo({
                        id: resource?.zenodo?.id,
                        source: resource?.zenodo?.source,
                      })
                    }
                    disabled={
                      !user ||
                      updateZenodo.isPending ||
                      (!user.super_user && resource?.owner !== user.id)
                    }
                  >
                    <ListItemIcon>
                      <RefreshIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Update</ListItemText>
                  </MenuItem>
                </span>
              </Tooltip>

              <Tooltip
                title={
                  !user.super_user && resource?.owner !== user.id
                    ? "You don't have permission"
                    : ""
                }
              >
                <span>
                  <MenuItem
                    onClick={handleDeleteClick}
                    disabled={
                      !user ||
                      updateZenodo.isPending ||
                      (!user.super_user && resource?.owner !== user.id)
                    }
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </span>
              </Tooltip>
            </>
          )
        )}
      </Menu>

      <DeleteConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        type={type}
        resource={resource}
        mutation={deleteMutation}
      />

      <EditResourceDialog
        open={editScopesOpen}
        onClose={handleCloseEditScopes}
        scopesQuery={scopesQuery}
        countriesQuery={countriesQuery}
        assessmentsQuery={assessmentsQuery}
        selectedScopes={selectedScopes}
        onToggleScope={handleToggleScope}
        mutation={updateQuery}
        onSave={handleSaveScopes}
      />
    </>
  );
}
export function ResourceItemAssessments({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;

  const getAssessmentIcon = (name) => {
    switch (name) {
      case "Researcher":
        return <PersonIcon fontSize="inherit" />;
      case "Researcher team/group":
        return <GroupIcon fontSize="inherit" />;
      case "Research organization":
        return <AccountBalanceIcon fontSize="inherit" />;
      default:
        return <FlagIcon fontSize="inherit" />;
    }
  };

  return (
    <AvatarGroup
      sx={{ ml: 0 }}
      slotProps={{
        additionalAvatar: {
          sx: {
            width: SIZE,
            height: SIZE,
            fontSize: FONT_SIZE,
          },
        },
      }}
    >
      {resource?.assessments?.map((assessment) => (
        <Tooltip key={assessment?.id} title={assessment?.description}>
          <Avatar
            alt={assessment?.name}
            sx={{
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              bgcolor: "grey.200",
              color: "text.primary",
            }}
          >
            {getAssessmentIcon(assessment?.name)}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}

export function ResourceItemScopes({ resource }) {
  const SIZE = 18;
  const FONT_SIZE = 12;
  return (
    <AvatarGroup
      sx={{ ml: 0 }}
      slotProps={{
        additionalAvatar: {
          sx: {
            width: SIZE,
            height: SIZE,
            fontSize: FONT_SIZE,
          },
        },
      }}
    >
      {resource?.scopes?.map((scope) => (
        <Tooltip key={scope?.id} title={scope?.description}>
          <Avatar
            alt={scope?.name}
            sx={{
              width: SIZE,
              height: SIZE,
              fontSize: FONT_SIZE,
              bgcolor: scope.bg_color ?? "#EB611F",
            }}
          >
            {scope?.name?.toUpperCase()[0]}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}

export function ResourceItemHeader({ resource, type, user }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      mb={2}
      sx={{ position: "relative" }}
    >
      <Stack direction="column" spacing={1} sx={{ flex: 1, pr: user ? 16 : 8 }}>
        <Stack direction="row" alignItems="center">
          <Typography
            variant="h6"
            sx={{
              whiteSpace: "break",
              overflow: "hidden",
              textOverflow: "break-word",
              fontWeight: "bold",
            }}
          >
            <Link to={"/" + type.toLowerCase() + "s/" + resource?._id}>
              {resource?.zenodo?.title}
            </Link>
          </Typography>
          <ResourceItemCommunities resource={resource} />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          gap: 1,
        }}
      >
        {user && (
          <ResourceActionsMenu resource={resource} type={type} user={user} />
        )}
      </Stack>
    </Stack>
  );
}

export function ResourceItemFooter({ resource, type }) {
  const MAX_AVATARS = 5;
  const SIZE = "1.1rem";
  const FONT_SIZE = "0.75rem";

  const geoEntries = Object.entries(resource?.geographical_coverage || {});
  const visibleGeos = geoEntries.slice(0, MAX_AVATARS);
  const hiddenGeos = geoEntries.slice(MAX_AVATARS);
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        {type !== "service" && (
          <>
            <Tooltip title="Publication date">
              <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {formatDate(resource?.zenodo?.metadata?.publication_date)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Version">
                <HistoryIcon sx={{ fontSize: "1.1rem" }} />
              </Tooltip>
              <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                {resource?.zenodo?.metadata?.version ?? "N/A"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="License">
                <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
              </Tooltip>
              <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                {resource?.zenodo?.metadata?.license?.id ?? "N/A"}
              </Typography>
            </Stack>
          </>
        )}
        {type === "service" && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="TRL">
              <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {resource?.tlr?.id + " - " + resource?.tlr?.description ?? "N/A"}
            </Typography>
          </Stack>
        )}
        <ResourceItemAssessments resource={resource} />
        <ResourceItemScopes resource={resource} />
        {resource?.geographical_coverage && (
          <AvatarGroup
            sx={{ ml: 2 }}
            slotProps={{
              additionalAvatar: {
                sx: {
                  width: SIZE,
                  height: SIZE,
                  fontSize: FONT_SIZE,
                },
              },
            }}
          >
            {visibleGeos.map(([geoId, geo]) => (
              <Tooltip key={geoId} title={geo.label || geoId}>
                <Avatar
                  alt={geo.label || geoId}
                  src={geo.flag}
                  sx={{
                    width: SIZE,
                    height: SIZE,
                    fontSize: FONT_SIZE,
                  }}
                >
                  {geo?.label.toUpperCase()[0]}
                </Avatar>
              </Tooltip>
            ))}

            {hiddenGeos.length > 0 && (
              <Tooltip
                title={hiddenGeos.map(([, geo]) => geo?.label || "").join(", ")}
              >
                <Avatar
                  sx={{
                    width: SIZE,
                    height: SIZE,
                    fontSize: FONT_SIZE,
                    ml: "-8px",
                    bgcolor: "grey.400",
                    zIndex: 1,
                    pointerEvents: "auto",
                  }}
                >
                  +{hiddenGeos?.length}
                </Avatar>
              </Tooltip>
            )}
          </AvatarGroup>
        )}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Downloads on Zenodo">
            <DownloadIcon sx={{ fontSize: "1.1rem" }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
            {resource?.zenodo?.stats?.unique_downloads ?? "N/A"}
          </Typography>
          <Tooltip title="Views on Zenodo">
            <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontSize: "0.95rem", mr: 2 }}>
            {resource?.zenodo?.stats?.unique_views ?? "N/A"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function ResourceItemContent({ resource }) {
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
          {stripHtml(resource?.zenodo?.metadata?.description)}
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
    </>
  );
}

import { Box } from "@mui/material";

export default function ResourceGridItem({ resource, type, user }) {
  const typeColors = {
    data: { bg: "#B3E5FC", color: "#01579B" },
    monitoring: { bg: "#C8E6C9", color: "#1B5E20" },
    enrichment: { bg: "#F8BBD0", color: "#880E4F" },
  };

  const { bg, color } = typeColors[resource?.service_type] || {
    bg: "#E0E0E0",
    color: "#424242",
  };
  return (
    <Grid key={resource?._id} size={{ xs: 12 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          borderRadius: "5px",
          border: "1px solid",
          borderColor: !resource?.approved ? "#FFD700" : "#e0dfdf",
          backgroundColor: !resource?.approved ? "#FFFDE7" : "#f8faff",
          boxShadow: 0,
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 4,
          },
          color: "#555",
        }}
      >
        {type === "service" && (
          <Box
            sx={{
              width: "30px",
              minWidth: "30px",
              backgroundColor: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              writingMode: "sideways-lr",
              textOrientation: "mixed",
              fontSize: 18,
              fontWeight: "bold",
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
            }}
          >
            {resource?.service_type?.toUpperCase()}
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ pb: 0 }}>
            <ResourceItemHeader resource={resource} type={type} user={user} />
            <ResourceItemContent resource={resource} />
          </CardContent>
          <CardContent
            sx={{
              paddingBottom: "8px !important",
              paddingTop: "0 !important",
              mt: "auto",
            }}
          >
            <ResourceItemFooter resource={resource} type={type} />
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
}
