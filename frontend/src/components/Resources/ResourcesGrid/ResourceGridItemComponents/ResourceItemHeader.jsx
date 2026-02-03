import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useDeleteDataset, useUpdateDataset } from "@queries/dataset";
import { useDeleteDocument, useUpdateDocument } from "@queries/document";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteTool, useUpdateTool } from "@queries/tool";

import VerifiedIcon from "@mui/icons-material/Verified";
import Notification from "@helpers/Notification";
import { useUpdateResources } from "@queries/update";
import EditIcon from "@mui/icons-material/Edit";
import { useScopes } from "@queries/scope";

import EditResourceDialog from "@components/Forms/EditResourceDialog";
import DeleteConfirmationDialog from "@components/Forms/DeleteConfirmationDialog";
import { useDeleteService, useUpdateService } from "@queries/service";
import { useCountries } from "@queries/countries";
import { useAssessments } from "@queries/assessment";

export function ResourceActionsMenu({ resource, type, user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editResourceOpen, setEditResourceOpen] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [queryState, setQueryState] = useState(false);
  const [message, setMessage] = useState("");

  const scopesQuery = useScopes();
  const countriesQuery = useCountries();
  const assessmentsQuery = useAssessments();
  const updateResources = useUpdateResources();

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

  const patchResourceQuery =
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
    patchResourceQuery.mutate(
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
      },
    );
  };

  const handleUpdateResource = (data) => {
    updateResources.mutate(data, {
      onSuccess: (data) => {
        setMessage(data?.data?.detail);
        handleClose;
      },
      onError: (error) => {
        setMessage(error?.response?.data?.detail || "Update failed");
        handleClose();
      },
    });
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
    handleClose();
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate({ id: resource?._id });
  };

  const handleOpenEditResource = () => {
    setEditResourceOpen(true);
    handleClose();
  };

  const handleCloseEditResource = () => setEditResourceOpen(false);

  const handleToggleScope = (scopeId) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId],
    );
  };

  const handlePatchResource = (updatedValues) => {
    patchResourceQuery.mutate(updatedValues);
  };

  return (
    resource && (
      <>
        <IconButton onClick={handleClick} size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {!resource?.approved && user?.super_user ? (
            <>
              <MenuItem
                onClick={() => handleUpdate(true)}
                disabled={queryState}
              >
                <ListItemIcon>
                  <Check fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Approve {type.toLowerCase()}</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => handleUpdate(false)}
                disabled={queryState}
              >
                <ListItemIcon>
                  <ClearIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Reject {type.toLowerCase()}</ListItemText>
              </MenuItem>

              <Tooltip
                title={
                  !user.super_user && resource?.owner !== user.id
                    ? "You don't have permission"
                    : ""
                }
              >
                <span>
                  <MenuItem
                    onClick={handleOpenEditResource}
                    disabled={
                      !user ||
                      updateResources.isPending ||
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
                      onClick={handleOpenEditResource}
                      disabled={
                        !user ||
                        updateResources.isPending ||
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
                {user?.super_user && (
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
                          handleUpdateResource({
                            zenodo_id: resource?.zenodo?.id || null,
                            openaire_id: resource?.openaire?.id || null,
                            source: resource?.zenodo?.source,
                          })
                        }
                        disabled={
                          !user ||
                          updateResources.isPending ||
                          (!user.super_user && resource?.owner !== user.id)
                        }
                      >
                        <ListItemIcon>
                          <RefreshIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          {updateResources.isPending ? "Syncing..." : "Sync"}
                        </ListItemText>
                      </MenuItem>
                    </span>
                  </Tooltip>
                )}
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
                        updateResources.isPending ||
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
          resource={resource}
          open={editResourceOpen}
          onClose={handleCloseEditResource}
          scopesQuery={scopesQuery}
          countriesQuery={countriesQuery}
          assessmentsQuery={assessmentsQuery}
          selectedScopes={selectedScopes}
          onToggleScope={handleToggleScope}
          mutation={patchResourceQuery}
          onSave={handlePatchResource}
        />

        {(updateResources?.isSuccess || updateResources?.isError) && (
          <Notification
            requestStatus={updateResources?.status}
            message={message}
          />
        )}
      </>
    )
  );
}

export function ResourceItemCommunities({ resource }) {
  const communities =
    resource?.zenodo?.metadata?.communities ||
    resource?.openaire?.metadata?.communities ||
    [];
  return communities.map(
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
      ),
  );
}

export default function ResourceItemHeader({ resource, type, user, isMobile }) {
  const title =
    resource?.zenodo?.title || resource?.openaire?.metadata?.name || "Untitled";

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      mb={2}
      sx={{ position: "relative" }}
    >
      <Stack direction="row" spacing={1}>
        <Typography
          variant="h6"
          sx={{
            whiteSpace: "break-spaces",
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "break-word",
            fontWeight: "bold",
          }}
        >
          <Link
            to={"/" + type.toLowerCase() + "s/" + resource?.resource_url_slug}
          >
            {title}
          </Link>
          <ResourceItemCommunities resource={resource} />
        </Typography>
      </Stack>

      <Stack direction="column" spacing={1} alignItems="flex-end">
        {user && (
          <ResourceActionsMenu resource={resource} type={type} user={user} />
        )}
      </Stack>
    </Stack>
  );
}
