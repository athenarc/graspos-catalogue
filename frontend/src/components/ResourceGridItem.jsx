import { useState } from "react";

import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";

import { useUserUsername } from "../queries/data";
import { useDeleteDataset, useUpdateDataset } from "../queries/dataset";
import { useDeleteDocument, useUpdateDocument } from "../queries/document";

import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ConfirmationModal from "./Forms/ConfirmationModal";
import { useDeleteTool, useUpdateTool } from "../queries/tool";

function AdminFunctionalities({ resource, type, handleUpdate }) {
  return (
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
          "Reject " + String(type) + ". " + String(type) + " will be deleted"
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
  );
}

function OwnerFunctionalities({ resource, user, type, handleDelete }) {
  return (
    user &&
    (user.id == resource.owner || user.super_user) && (
      <>
        <Tooltip title={"Edit " + String(type)}>
          <div>
            <IconButton disabled={!user}>
              <EditIcon />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title={"Delete " + String(type)} placement="top">
          <div>
            <ConfirmationModal
              title={"Delete " + String(type)}
              resource={resource}
              response={() => handleDelete(resource._id)}
            >
              {(handleClickOpen) => (
                <IconButton
                  color="error"
                  disabled={!user}
                  onClick={handleClickOpen}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ConfirmationModal>
          </div>
        </Tooltip>
      </>
    )
  );
}

function ResourceItemHeader({
  resource,
  user,
  type,
  handleUpdate,
  handleDelete,
}) {
  return (
    <>
      <Stack direction={"row"} justifyContent="center" spacing={1}>
        <Typography variant="h6">{resource?.title}</Typography>
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
      <Stack
        component={Stack}
        direction={"row"}
        spacing={0}
        sx={{ p: "0!important" }}
      >
        {!resource.approved && user?.super_user ? (
          <AdminFunctionalities
            handleUpdate={handleUpdate}
            resource={resource}
            type={type}
          />
        ) : (
          <OwnerFunctionalities
            handleDelete={handleDelete}
            resource={resource}
            user={user}
            type={type}
          />
        )}
      </Stack>
    </>
  );
}

export default function ResourceGridItem({ resource, type, user }) {
  const ownerUsername = useUserUsername(resource?.owner, user);
  const deleteDatasest = useDeleteDataset();
  const deleteDocument = useDeleteDocument();
  const deleteTool = useDeleteTool();
  const updateDataset = useUpdateDataset(resource._id);
  const updateDocument = useUpdateDocument(resource._id);
  const updateTool = useUpdateTool(resource._id);
  const [showDescription, setShowDescription] = useState(false);

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
  function handleUpdate(approved) {
    if (type === "Document") {
      query = updateDocument;
    } else if (type === "Dataset") {
      query = updateDataset;
    } else {
      query = updateTool;
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
        backgroundColor: [
          type == "Dataset"
            ? "#FFC067"
            : type == "Document"
            ? "#2B3A57"
            : "#FF6961",
        ],
      }}
    >
      <CardContent
        component={Stack}
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "white", pb: 0 }}
      >
        <ResourceItemHeader
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          resource={resource}
          user={user}
          type={type}
        />
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
          <CloudUploadIcon />
          <Typography>
            {user ? ownerUsername?.data?.data?.username : "N/A"}
          </Typography>
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
