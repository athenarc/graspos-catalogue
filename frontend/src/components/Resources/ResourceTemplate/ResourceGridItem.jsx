import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import {
  Grid2 as Grid,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Grid2,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  AvatarGroup,
} from "@mui/material";
import DOMPurify from "isomorphic-dompurify";

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

import VerifiedIcon from "@mui/icons-material/Verified"; // Add this import

import { useUpdateZenodo } from "../../../queries/zenodo";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import HistoryIcon from "@mui/icons-material/History"; // Add this import
import AssignmentIcon from "@mui/icons-material/Assignment"; // Add this import
import EditIcon from "@mui/icons-material/Edit";
import { useScopes } from "../../../queries/scope";

import SaveIcon from "@mui/icons-material/Save";
import EditResourceDialog from "../../Forms/EditResourceDialog";
import DeleteConfirmationDialog from "../../Forms/DeleteConfirmationDialog";

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
  const updateZenodo = useUpdateZenodo();

  // Mutations
  const updateDocument = useUpdateDocument(resource?._id);
  const updateDataset = useUpdateDataset(resource?._id);
  const updateTool = useUpdateTool(resource?._id);

  const deleteDocument = useDeleteDocument();
  const deleteDataset = useDeleteDataset();
  const deleteTool = useDeleteTool();

  const deleteMutation =
    type === "Document"
      ? deleteDocument
      : type === "Dataset"
      ? deleteDataset
      : deleteTool;

  const updateQuery =
    type === "Document"
      ? updateDocument
      : type === "Dataset"
      ? updateDataset
      : updateTool;

  useEffect(() => {
    if (resource?.scopes) {
      setSelectedScopes(resource.scopes.map((s) => s._id || s.id));
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

  const handleSaveScopes = () => {
    updateQuery.mutate({ scopes: selectedScopes });
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.9)",
          },
        }}
      >
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
                  !user?.super_user && resource?.owner !== user?.id
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
                      (!user?.super_user && resource?.owner !== user?.id)
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
                  !user?.super_user && resource?.owner !== user?.id
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
                      (!user?.super_user && resource?.owner !== user?.id)
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
                  !user?.super_user && resource?.owner !== user?.id
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
                      (!user?.super_user && resource?.owner !== user?.id)
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
        selectedScopes={selectedScopes}
        onToggleScope={handleToggleScope}
        mutation={updateQuery}
        onSave={handleSaveScopes}
      />
    </>
  );
}

export function ResourceItemScopes({ resource }) {
  return (
    <Stack direction="row" alignItems="flex-start">
      {resource?.scopes?.map((scope) => (
        <Tooltip title={scope?.description} key={scope?.id}>
          <Avatar
            key={scope?.id}
            sx={{
              width: 18,
              height: 18,
              fontSize: 12,
              mr: 1,
              backgroundColor: scope.bg_color ?? "#EB611F",
            }}
          >
            {scope?.name?.toUpperCase()[0]}
          </Avatar>
        </Tooltip>
      ))}
    </Stack>
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

export function ResourceItemFooter({ resource }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title="Publication date">
          <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
        </Tooltip>
        {resource?.zenodo?.metadata?.publication_date && (
          <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
            {formatDate(resource.zenodo.metadata.publication_date)}
          </Typography>
        )}
        {resource?.zenodo?.metadata?.version && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Version">
              <HistoryIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {resource.zenodo.metadata.version}
            </Typography>
          </Stack>
        )}
        {resource?.zenodo?.metadata?.license?.id && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="License">
              <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
              {resource.zenodo.metadata.license.id}
            </Typography>
          </Stack>
        )}

        {/* Add AvatarGroup here */}
        {resource?.geographical_coverage && (
          <AvatarGroup max={5} sx={{ ml: 2 }}>
            {Object.entries(resource.geographical_coverage).map(
              ([geoId, geo]) => (
                <Tooltip key={geoId} title={geo.label || geoId}>
                  <Avatar
                    alt={geo.label || geoId}
                    src={geo.flag}
                    sx={{
                      width: "1.1rem",
                      height: "1.1rem",
                      fontSize: "0.75rem",
                    }}
                  />
                </Tooltip>
              )
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
            {resource?.zenodo?.stats?.unique_downloads}
          </Typography>
          <Tooltip title="Views on Zenodo">
            <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontSize: "0.95rem", mr: 2 }}>
            {resource?.zenodo?.stats?.unique_views}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function ResourceItemContent({ resource }) {
  const sanitizedHtml = DOMPurify.sanitize(
    resource?.zenodo?.metadata?.description
  );
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
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
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

export default function ResourceGridItem({ resource, type, user }) {
  return (
    <Grid key={resource?._id} size={{ xs: 12 }}>
      <Card
        sx={{
          height: "100%",
          lineHeight: 1.5,
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
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
        <CardContent sx={{ pb: 0 }}>
          <ResourceItemHeader resource={resource} type={type} user={user} />
          <ResourceItemScopes resource={resource} />
          <ResourceItemContent resource={resource} />
        </CardContent>
        <CardContent
          sx={{
            paddingBottom: "8px !important",
            paddingTop: "0 !important",
          }}
        >
          <ResourceItemFooter resource={resource} />
        </CardContent>
      </Card>
    </Grid>
  );
}
