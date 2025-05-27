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

export function ResourceActionsMenu({ resource, type, user, handleDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // New state for scopes modal
  const [editScopesOpen, setEditScopesOpen] = useState(false);
  const scopesQuery = useScopes();

  // Track selected scopes for editing
  const [selectedScopes, setSelectedScopes] = useState([]);

  const updateZenodo = useUpdateZenodo();
  const [queryState, setQueryState] = useState(false);

  // Update hooks
  const updateDocument = useUpdateDocument(resource?._id);
  const updateDataset = useUpdateDataset(resource?._id);
  const updateTool = useUpdateTool(resource?._id);

  // Initialize selected scopes when modal opens or resource changes
  useEffect(() => {
    if (resource?.scopes) {
      setSelectedScopes(resource.scopes.map((s) => s._id || s.id)); // fallback on id
    }
  }, [resource]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateZenodo = (data) => {
    updateZenodo.mutate(
      { data },
      {
        onSuccess: () => handleClose(),
        onError: () => handleClose(),
      }
    );
  };

  const handleUpdate = (approved) => {
    setQueryState(true);
    const updateQuery =
      type === "Document"
        ? updateDocument
        : type === "Dataset"
        ? updateDataset
        : updateTool;

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

  const handleDeleteClick = () => {
    setConfirmDelete(true);
    handleClose();
  };

  const handleConfirmDelete = () => {
    handleDelete(resource?._id);
    setConfirmDelete(false);
  };

  // New handlers for scopes modal
  const handleOpenEditScopes = () => {
    setEditScopesOpen(true);
    handleClose();
  };

  const handleCloseEditScopes = () => {
    setEditScopesOpen(false);
  };

  const handleToggleScope = (scopeId) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleSaveScopes = () => {
    setQueryState(true);

    const updateQuery =
      type === "Document"
        ? updateDocument
        : type === "Dataset"
        ? updateDataset
        : updateTool;

    updateQuery.mutate(
      { scopes: selectedScopes },
      {
        onSuccess: () => {
          setQueryState(false);
          setEditScopesOpen(false);
        },
        onError: () => {
          setQueryState(false);
          // optionally show error feedback
        },
      }
    );
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
                  !user || (!user?.super_user && resource?.owner !== user?.id)
                    ? "You don't have permission to perform this action"
                    : ""
                }
              >
                <span>
                  {/* Wrapper needed for disabled elements */}
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
                    <ListItemText>Edit scopes</ListItemText>
                  </MenuItem>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  !user || (!user?.super_user && resource?.owner !== user?.id)
                    ? "You don't have permission to perform this action"
                    : updateZenodo.isPending
                    ? "Update in progress..."
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
                  !user || (!user?.super_user && resource?.owner !== user?.id)
                    ? "You don't have permission to perform this action"
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

      {/* Delete confirmation modal (existing) */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Delete {type.toLowerCase()}
          <IconButton
            aria-label="close"
            onClick={() => setConfirmDelete(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, pb: 3, pt: 3 }}>
          <Stack spacing={4}>
            <Typography sx={{ mt: 5 }}>
              Are you sure you want to delete this {type.toLowerCase()}?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Title: {resource?.zenodo?.title}
            </Typography>
            <Box
              sx={{
                bgcolor: "#fff3f3",
                border: "1px solid #ffcdd2",
                borderRadius: 1,
                p: 2,
              }}
            >
              <Typography
                color="error"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 500,
                }}
              >
                <DeleteIcon color="error" fontSize="small" />
                This action cannot be undone. The resource will be permanently
                removed.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setConfirmDelete(false)}
            variant="outlined"
            sx={{ borderColor: "rgba(0, 0, 0, 0.1)", color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Edit Scopes Modal */}
      <Dialog
        open={editScopesOpen}
        onClose={handleCloseEditScopes}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Edit Scopes
          <IconButton
            aria-label="close"
            onClick={handleCloseEditScopes}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent dividers>
          {!scopesQuery.isLoading && scopesQuery.data ? (
            <FormGroup>
              <Grid2 container spacing={2}>
                {scopesQuery?.data?.data?.map((scope) => (
                  <Grid2 item xs={12} sm={6} md={4} key={scope._id}>
                    <Card
                      variant="outlined"
                      sx={{ borderColor: scope.bg_color ?? "#1976d2" }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="start"
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {scope.name}
                          </Typography>
                          <Checkbox
                            checked={selectedScopes.includes(scope._id)}
                            onChange={() => handleToggleScope(scope._id)}
                            sx={{
                              color: scope.bg_color ?? "#1976d2",
                              p: 0,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {scope.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            </FormGroup>
          ) : (
            <Typography>Loading scopes...</Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button onClick={handleCloseEditScopes} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveScopes}
            variant="contained"
            loading={queryState}
            loadingPosition="end"
            endIcon={<SaveIcon />}
            sx={{ backgroundColor: "#20477B" }}
          >
            {queryState ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
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

export function ResourceItemHeader({ resource, type, user, handleDelete }) {
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
          <ResourceActionsMenu
            resource={resource}
            type={type}
            user={user}
            handleDelete={handleDelete}
          />
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
  const deleteDatasest = useDeleteDataset();
  const deleteDocument = useDeleteDocument();
  const deleteTool = useDeleteTool();

  let query = null;

  function handleDelete(id) {
    if (type === "Document") {
      query = deleteDocument;
    } else if (type === "Dataset") {
      query = deleteDatasest;
    } else {
      query = deleteTool;
    }
    query.mutate(
      { id },
      {
        onSuccess: (data) => {},
        onError: (e) => {},
      }
    );
  }

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
          <ResourceItemHeader
            resource={resource}
            type={type}
            user={user}
            handleDelete={handleDelete}
          />
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
