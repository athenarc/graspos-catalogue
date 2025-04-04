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
  Grid2,
} from "@mui/material";

import { useDeleteDataset, useUpdateDataset } from "../queries/dataset";
import { useDeleteDocument, useUpdateDocument } from "../queries/document";

import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationModal from "./Forms/ConfirmationModal";
import { useDeleteTool, useUpdateTool } from "../queries/tool";

import grasposTools from "../assets/graspos_tools.png";

import { useUpdateZenodo } from "../queries/zenodo";

const imgs = {
  "graspos-tools": grasposTools,
};

function ResourceAdminFunctionalities({ type, resource }) {
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
    <Stack direction="row">
      <Tooltip title={"Approve " + String(type)}>
        <IconButton
          disabled={queryState}
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
          "Reject " + String(type) + ". " + String(type) + " will be deleted"
        }
        sx={{ p: 0.5 }}
      >
        <IconButton
          disabled={queryState}
          color="error"
          onClick={() => {
            handleUpdate(false);
          }}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function ResourceOwnerFunctionalities({ resource, user, type, handleDelete }) {
  const updateZenodo = useUpdateZenodo();

  function handleUpdateZenodo(data) {
    updateZenodo.mutate(
      { data },
      {
        onSuccess: (data) => {},
        onError: (e) => {},
      }
    );
  }
  return (
    <>
      <Tooltip
        title={"Update " + String(type) + " from Zenodo"}
        placement="top"
      >
        <IconButton
          disabled={
            !user ||
            updateZenodo.isPending ||
            (!user?.super_user && resource?.owner != user?.id)
          }
          onClick={() =>
            handleUpdateZenodo({
              id: resource?.zenodo?.id,
              source: resource?.zenodo?.source,
            })
          }
          sx={{ p: 0.5 }}
          loading={updateZenodo.isPending}
          loadingIndicator={
            <CircularProgress size={15} thickness={5} sx={{ mr: 2.5 }} />
          }
        >
          {!updateZenodo.isPending && <RefreshIcon />}
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
                disabled={
                  !user ||
                  updateZenodo.isPending ||
                  (!user?.super_user && resource?.owner != user?.id)
                }
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
  );
}

function ResourceItemKeywords({ resource }) {
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

function ResourceItemCommunities({ resource }) {
  return (
    <Stack direction={"row"} justifyContent="center" spacing={1}>
      {resource?.zenodo?.metadata?.communities?.map(
        (community) =>
          community.id == "graspos-tools" && (
            <Tooltip
              key={community.id}
              title={"Part of " + community.id.replaceAll("-", " ")}
            >
              <div id={community.id}>
                <img
                  src={imgs[community?.id]}
                  alt={community.id}
                  width={"70"}
                  height={"20"}
                />
              </div>
            </Tooltip>
          )
      )}
    </Stack>
  );
}

function ResourceItemFooter({ handleDelete, resource, user, type }) {
  return (
    <Stack direction="column" justifyContent="end">
      <Stack
        direction={"row"}
        justifyContent="start"
        alignItems="center"
        spacing={1}
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
        sx={{ pt: 1 }}
      >
        <Stack direction={"row"} spacing={1} sx={{ p: "0!important" }}>
          <ResourceItemCommunities resource={resource} />
        </Stack>
        <Stack direction={"row"} spacing={0} sx={{ p: "0!important" }}>
          {!resource?.approved && user?.super_user ? (
            <ResourceAdminFunctionalities resource={resource} type={type} />
          ) : (
            <ResourceOwnerFunctionalities
              handleDelete={handleDelete}
              resource={resource}
              user={user}
              type={type}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 1000,
  },
});

function ResourceItemContent({ resource }) {
  return (
    <>
      <Stack direction={"row"} spacing={2} sx={{ pb: 2 }}>
        <ResourceItemKeywords resource={resource} />
      </Stack>
      <Stack direction={"row"} spacing={2} sx={{ pb: 2 }}>
        <NoMaxWidthTooltip title={resource?.zenodo?.metadata?.description}>
          <Typography
            variant="subtitle"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              [`& .tooltip`]: {
                maxWidth: 1000,
              },
            }}
          >
            {resource?.zenodo?.metadata?.description}
          </Typography>
        </NoMaxWidthTooltip>
      </Stack>
      <Stack direction="row">
        {resource?.zenodo?.metadata?.creators?.map(
          (author) => author?.name + "; "
        )}
      </Stack>
    </>
  );
}

function ResourceItemHeader({ resource }) {
  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
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
      {!resource?.approved && (
        <Tooltip title="Resource pending approval">
          <PendingActionsIcon color="warning" fontSize="small" />
        </Tooltip>
      )}
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
    <Grid key={resource?._id} size={{ xs: 10, sm: 4 }}>
      <Card
        elevation={1}
        sx={{
          height: "100%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "10px",
        }}
      >
        <CardContent>
          <ResourceItemHeader resource={resource} />
          <ResourceItemContent resource={resource} />
        </CardContent>
        <CardContent
          sx={{
            paddingBottom: "16px !important;",
          }}
        >
          <ResourceItemFooter
            handleDelete={handleDelete}
            resource={resource}
            user={user}
            type={type}
          />
        </CardContent>
      </Card>
    </Grid>
  );
}
