import { Link } from "react-router-dom";
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
  CardActions,
  Grid2,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationModal from "./Forms/ConfirmationModal";
import { useDeleteTool, useUpdateTool } from "../queries/tool";

import euLogo from "../assets/eu-logo.jpg";
import openaireGraphLogo from "../assets/openaire-graph-logo.png";
import openaireLogo from "../assets/openaire-logo.png";
import scilakeLogo from "../assets/scilake_project.png";
import openScienceRra from "../assets/open_science_rra.png";
import caa2024 from "../assets/caa2024.png";
import grasposTools from "../assets/graspos_tools.png";
import pathos from "../assets/pathos.png";
import robertkochinstitut from "../assets/robertkochinstitut.png";
import { useUpdateZenodo } from "../queries/zenodo";

const imgs = {
  eu: euLogo,
  "openaire-research-graph": openaireGraphLogo,
  openaire: openaireLogo,
  scilake_project: scilakeLogo,
  open_science_rra: openScienceRra,
  caa2024: caa2024,
  "graspos-tools": grasposTools,
  pathos: pathos,
  robertkochinstitut: robertkochinstitut,
};

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
  const updateZenodo = useUpdateZenodo();

  function handleUpdateZenodo(id) {
    updateZenodo.mutate(
      { id },
      {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );
  }
  return (
    user &&
    (user?.id == resource?.owner || user?.super_user) && (
      <>
        <Tooltip
          title={"Update " + String(type) + " from Zenodo"}
          placement="top"
        >
          <IconButton
            disabled={!user}
            onClick={() => handleUpdateZenodo(resource?.zenodo?.id)}
            sx={{ p: 0.5 }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
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
      </>
    )
  );
}

function ResourceItemsKeywords({ resource }) {
  return (
    <Stack direction="column" justifyContent="center">
      <Grid2 container spacing={1}>
        {resource?.zenodo?.metadata?.keywords?.map((keyword) => (
          <Grid2
            key={keyword}
            sx={{
              borderRadius: "10px",
              border: "2px solid #a2bffe",
              p: 0.5,
              color: "black",
            }}
          >
            <Typography fontSize={12}>{keyword}</Typography>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}

function ResourceItemsCommunities({ resource }) {
  return (
    <Stack direction={"row"} justifyContent="center" spacing={1}>
      {resource?.zenodo?.metadata?.communities?.map((community) => (
        <Tooltip
          key={community.id}
          title={"Part of " + community.id.replaceAll("-", " ")}
        >
          <div id={community.id}>
            <img
              src={imgs[community?.id]}
              alt={community.id}
              width={"30"}
              height={"20"}
            />
          </div>
        </Tooltip>
      ))}
    </Stack>
  );
}

function ResourceItemFooter({ resource, user }) {
  const ownerUsername = useUserUsername(resource?.owner, user);
  return (
    <>
      <Stack
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
        {resource?.zenodo?.metadata?.publication_date && (
          <Typography>
            {new Date(
              resource?.zenodo?.metadata?.publication_date
            ).toLocaleDateString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </Typography>
        )}
        {resource?.zenodo?.metadata?.version && (
          <Typography>(v.{resource?.zenodo?.metadata?.version})</Typography>
        )}
      </Stack>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "white", pt: 2 }}
      >
        <Stack direction={"row"} spacing={1} sx={{ p: "0!important" }}>
          <Tooltip title={"User that uploaded the resource"}>
            <CloudUploadIcon />
          </Tooltip>
          <Typography>
            {user ? ownerUsername?.data?.data?.username : "N/A"}
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={1} sx={{ p: "0!important" }}>
          <ResourceItemsCommunities resource={resource} />
        </Stack>
      </Stack>
    </>
  );
}
function ResourceItemContent({ resource }) {
  const [showDescription, setShowDescription] = useState(false);
  return (
    <>
      <Stack direction={"row"} spacing={2} sx={{ pb: 2 }}>
        <ResourceItemsKeywords resource={resource} />
      </Stack>
      <Stack
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
      </Stack>

      {showDescription && (
        <Stack
          direction="row"
          sx={{
            backgroundColor: "beige",
            p: 2,
            height: "50px",
            overflow: "auto",
          }}
        >
          {resource?.zenodo?.metadata?.description}
        </Stack>
      )}
      <Stack direction="row">
        {resource?.zenodo?.metadata?.creators?.map(
          (author) => author?.name + "; "
        )}
      </Stack>
    </>
  );
}

function ResourceItemHeader({ resource, user, type, handleDelete }) {
  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Stack direction={"row"} justifyContent="center" spacing={1}>
        <Tooltip title={resource?.zenodo?.title}>
          <Typography
            variant="h6"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "25vw",
            }}
          >
            <Link target="_blank" to={resource?.zenodo?.doi_url}>
              {resource?.zenodo?.title}
            </Link>
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
      <Stack direction={"row"} spacing={0} sx={{ p: "0!important" }}>
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
    </Stack>
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
    <Grid key={resource?._id} size={{ xs: 10, md: 4 }}>
      <Card
        sx={{
          height: "100%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "10px",
        }}
      >
        <CardContent>
          <Typography
            variant={"subtitle2"}
            sx={{
              p: 1,
              mb: 2,
              color: "#fff",
              textAlign: "center",
              borderRadius: "1px",
              height: "22px",
              backgroundColor: [
                type == "Dataset"
                  ? "#FFC067"
                  : type == "Document"
                  ? "#2B3A57"
                  : "#FF6961",
              ],
            }}
          >
            {type.toUpperCase()}
          </Typography>
          <ResourceItemHeader
            handleDelete={handleDelete}
            resource={resource}
            user={user}
            type={type}
          />
          <ResourceItemContent resource={resource} />
        </CardContent>
        <CardContent
          sx={{
            backgroundColor: "white",
            paddingBottom: "16px !important;",
          }}
        >
          <ResourceItemFooter resource={resource} user={user} />
        </CardContent>
      </Card>
    </Grid>
  );
}
