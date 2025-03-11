import { useState } from "react";

import {
  Grid2 as Grid,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";

import { useUserUsername } from "../queries/data";
import { useDeleteDataset, useUpdateDataset } from "../queries/dataset";
import { useDeleteDocument, useUpdateDocument } from "../queries/document";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationModal from "./Forms/ConfirmationModal";
import { useDeleteTool, useUpdateTool } from "../queries/tool";

import euLogo from "../assets/eu-logo.jpg";
import openaireGraphLogo from "../assets/openaire-graph-logo.png";
import openaireLogo from "../assets/openaire-logo.png";

function AdminFunctionalities({ type, resource }) {
  const updateDataset = useUpdateDataset(resource?._id);
  const updateDocument = useUpdateDocument(resource?._id);
  const updateTool = useUpdateTool(resource?._id);
  const [queryState, setQueryState] = useState(false);
  let query = null;
  function handleUpdate(approved) {
    setQueryState(true);
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
        onSuccess: (data) => {
          setQueryState(false);
        },
        onError: (e) => {
          setQueryState(false);
        },
      }
    );
  }
  return (
    <>
      {queryState && (
        <Tooltip title={"Updating resource"}>
          <CircularProgress size="13px" sx={{ p: 1 }} />
        </Tooltip>
      )}
      {!queryState && (
        <>
          <Tooltip title={"Approve " + String(type)}>
            <IconButton
              color="success"
              onClick={() => {
                handleUpdate(true);
              }}
              sx={{ p: 0.5 }}
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
            sx={{ p: 0.5 }}
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
      )}
    </>
  );
}

function OwnerFunctionalities({ resource, user, type, handleDelete }) {
  return (
    user &&
    (user?.id == resource?.owner || user?.super_user) && (
      <Tooltip title={"Delete " + String(type)} placement="top">
        <div>
          <ConfirmationModal
            title={"Delete " + String(type)}
            resource={resource}
            response={() => handleDelete(resource?._id)}
          >
            {(handleClickOpen) => (
              <IconButton
                color="error"
                disabled={!user}
                onClick={handleClickOpen}
                sx={{ p: 0.5 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ConfirmationModal>
        </div>
      </Tooltip>
    )
  );
}

function ResourceItemsCommunities({ resource }) {
  return (
    <Stack direction={"row"} justifyContent="center" spacing={1}>
      {resource?.zenodo_metadata?.metadata?.communities?.map((community) => (
        <Tooltip
          key={community.id}
          title={"Part of " + community.id.replaceAll("-", " ")}
        >
          <div id={community.id}>
            {community.id == "eu" && (
              <img src={euLogo} alt="Logo" width={"30"} height={"20"} />
            )}
            {community.id == "openaire-research-graph" && (
              <img
                src={openaireGraphLogo}
                alt="Logo"
                width={"60"}
                height={"20"}
              />
            )}
            {community.id == "openaire" && (
              <img src={openaireLogo} alt="Logo" width={"25"} height={"20"} />
            )}
          </div>
        </Tooltip>
      ))}
    </Stack>
  );
}

function ResourceItemHeader({ resource, user, type, handleDelete }) {
  return (
    <>
      <Stack direction={"row"} justifyContent="center" spacing={1}>
        <Tooltip title={resource?.zenodo_metadata?.title}>
          <Typography
            variant="h6"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 300,
            }}
          >
            {resource?.zenodo_metadata?.title}
          </Typography>
        </Tooltip>
        {resource?.approved ? (
          <Tooltip title="Resource approved">
            <CheckCircleIcon color="success" fontSize="small" />
          </Tooltip>
        ) : (
          <Tooltip title="Resource pending approval">
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
        {!resource?.approved && user?.super_user ? (
          <AdminFunctionalities resource={resource} type={type} />
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
        sx={{ backgroundColor: "white", pb: 2 }}
      >
        <ResourceItemHeader
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
          {resource?.zenodo_metadata?.metadata?.description}
        </CardContent>
      )}
      <CardContent
        component={Stack}
        direction={"row"}
        justifyContent="start"
        alignItems="center"
        spacing={1}
        sx={{
          backgroundColor: "white",
          pb: 0,
          pt: 3,
        }}
      >
        <Tooltip title="Zenodo published date">
          <CalendarMonthIcon />
        </Tooltip>
        {resource?.zenodo_metadata?.metadata?.publication_date && (
          <Typography>
            {new Date(
              resource?.zenodo_metadata?.metadata?.publication_date
            ).toLocaleDateString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </Typography>
        )}
      </CardContent>
      <CardContent
        component={Stack}
        direction={"row"}
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "white", pt: 2 }}
      >
        <CardContent
          component={Stack}
          direction={"row"}
          spacing={1}
          sx={{ p: "0!important" }}
        >
          <Tooltip title={"User that uploaded the resource"}>
            <CloudUploadIcon />
          </Tooltip>
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
          <ResourceItemsCommunities resource={resource} />
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
