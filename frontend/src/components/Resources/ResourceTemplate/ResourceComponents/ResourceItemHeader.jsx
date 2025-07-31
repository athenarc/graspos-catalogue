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

import {
  useDeleteDataset,
  useUpdateDataset,
} from "../../../../queries/dataset";
import {
  useDeleteDocument,
  useUpdateDocument,
} from "../../../../queries/document";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteTool, useUpdateTool } from "../../../../queries/tool";

import VerifiedIcon from "@mui/icons-material/Verified";

import { useUpdateZenodo } from "../../../../queries/zenodo";

import EditIcon from "@mui/icons-material/Edit";
import { useScopes } from "../../../../queries/scope";

import EditResourceDialog from "../../../Forms/EditResourceDialog";
import DeleteConfirmationDialog from "../../../Forms/DeleteConfirmationDialog";
import {
  useDeleteService,
  useUpdateService,
} from "../../../../queries/service";
import { useCountries } from "../../../../queries/countries";
import { useAssessments } from "../../../../queries/assessment";

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

export function ResourceItemCommunities({ resource }) {
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

export default function ResourceItemHeader({ resource, type, user }) {
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
