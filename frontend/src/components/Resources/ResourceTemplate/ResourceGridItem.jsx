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
  Chip,
  Divider
} from "@mui/material";

import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { useDeleteDataset, useUpdateDataset } from "../../../queries/dataset";
import {
  useDeleteDocument,
  useUpdateDocument,
} from "../../../queries/document";

import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationModal from "../../Forms/ConfirmationModal";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDeleteTool, useUpdateTool } from "../../../queries/tool";

import grasposTools from "../../../assets/os.svg";

import { useUpdateZenodo } from "../../../queries/zenodo";

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
    user && (
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
    )
  );
}

function ResourceItemKeywords({ resource }) {
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
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
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
          <div id={community.id}>
            <img
              src={grasposTools}
              alt={community.id}
              width={"50"}
              height={"20"}
            />
          </div>
        </Tooltip>
      )
  );
}

function ResourceItemFooter({ handleDelete, resource, user, type }) {
  return (
    <Stack 
      direction="row" 
      justifyContent="space-between"
      sx={{ 
        fontSize: '0.95rem',  // Slightly larger than before (was 0.875rem)
        py: 0.75  // Slightly more vertical padding
      }}
    >
      <Stack
        direction="row"
        justifyContent="start"
        alignItems="center"
        spacing={1}  // Increased from 0.5 for more horizontal spacing
      >
        <Tooltip title="Publication date">
          <CalendarMonthIcon sx={{ fontSize: '1.1rem' }} />
        </Tooltip>
        {resource?.zenodo?.metadata?.publication_date && (
          <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
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
          <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
            (v.{resource?.zenodo?.metadata?.version})
          </Typography>
        )}
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Downloads on Zenodo">
          <DownloadIcon sx={{ fontSize: '1.1rem' }} />
        </Tooltip>
        <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
          {resource?.zenodo?.stats?.downloads}
        </Typography>
        <Tooltip title="Views on Zenodo">
          <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
        </Tooltip>
        <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
          {resource?.zenodo?.stats?.views}
        </Typography>
      </Stack>
      
      <Stack
        direction={"row"}
        spacing={0}
        sx={{ p: "0!important", textAlign: "right" }}
      >
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
        {/* <NoMaxWidthTooltip title={resource?.zenodo?.metadata?.description}> */}
        <Typography
          variant="subtitle"
          sx={{
            variant: 'paragraph',
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical",
            [`& .tooltip`]: {
              maxWidth: 2000,
            },
          }}
        >
          {resource?.zenodo?.metadata?.description}
        </Typography>
        {/* </NoMaxWidthTooltip> */}
      </Stack>
      
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ pt: 0, pb: 0 }}
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

function ResourceItemHeader({ resource, type }) {
  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      {/* <Tooltip title={resource?.zenodo?.title}> */}
        <Typography
          variant="h6"
          sx={{
            whiteSpace: "break",
            overflow: "hidden",
            textOverflow: "break-word",
            fontWeight: "bold",
          }}
        >
          <Link
            to={"/" + type.toLowerCase() + "s/" + resource?._id}
          >
            {resource?.zenodo?.title}
          </Link>
        </Typography>
      {/* </Tooltip> */}
      {!resource?.approved && (
        <Tooltip title="Resource pending approval">
          <PendingActionsIcon color="warning" fontSize="small" />
        </Tooltip>
      )}
      <ResourceItemCommunities resource={resource} />
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
    <Grid key={resource?._id} size={{ xs: 12 }}>
      <Card
        sx={{
          height: "100%",
          lineHeight: 1.5,
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "5px",
          border: '1px solid #e0dfdf',
          backgroundColor: "#f8faff",
          boxShadow: 0, // No default shadow
          transition: "box-shadow 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            boxShadow: 4, // Shadow on hover
          },
          color: "#555",
        }}
      >
        <CardContent sx={{ pb: 0 }}>
          <ResourceItemHeader resource={resource} type={type} />
          <ResourceItemContent resource={resource} />
        </CardContent>
        <CardContent
          sx={{
            paddingBottom: "8px !important",  // Reduced bottom padding
            pt: 0.5,  // Reduced top padding
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
