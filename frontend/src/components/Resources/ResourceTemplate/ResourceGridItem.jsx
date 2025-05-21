import { Link } from "react-router-dom";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

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
  Box, // Add this import
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";

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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteTool, useUpdateTool } from "../../../queries/tool";

import grasposTools from "../../../assets/os.svg";

import { useUpdateZenodo } from "../../../queries/zenodo";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const imgs = {
  "graspos-tools": grasposTools,
};

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

export function ResourceItemCommunities({ resource }) {
  // ...existing code...
}

export function ResourceActionsMenu({ resource, type, user, handleDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateZenodo = useUpdateZenodo();
  const [queryState, setQueryState] = useState(false);
  
  // Initialize update hooks at component level
  const updateDocument = useUpdateDocument(resource?._id);
  const updateDataset = useUpdateDataset(resource?._id);
  const updateTool = useUpdateTool(resource?._id);

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
    // Use the pre-initialized hooks
    const updateQuery = type === "Document" 
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

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
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
                    : updateZenodo.isPending
                    ? "Update in progress..."
                    : ""
                }
              >
                <span> {/* Wrapper needed for disabled elements */}
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
                <span> {/* Wrapper needed for disabled elements */}
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

      {/* Updated Delete Confirmation Dialog to match Zenodo form style */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: '#20477B',
            color: 'white',
            textAlign: "center",
          }}
        >
          Delete {type.toLowerCase()}

          <IconButton
            aria-label="close"
            onClick={() => setConfirmDelete(false)}  // Changed this line
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
              sx={{ fontStyle: 'italic' }}
            >
              Title: {resource?.zenodo?.title}
            </Typography>
            <Box
              sx={{
                bgcolor: '#fff3f3',
                border: '1px solid #ffcdd2',
                borderRadius: 1,
                p: 2,
              }}
            >
              <Typography
                color="error"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 500,
                }}
              >
                <DeleteIcon color="error" fontSize="small" />
                This action cannot be undone. The resource will be permanently removed.
              </Typography>
            </Box>
            
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: '#f8f9fa',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            onClick={() => setConfirmDelete(false)}
            variant="outlined"
            sx={{
              mr: 1,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
            }}
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
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
      <Stack direction="column" spacing={1} sx={{ flex: 1, pr: user ? 8 : 0 }}>
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
      </Stack>

      {/* Only show actions menu if user is logged in */}
      {user && (
        <ResourceActionsMenu
          resource={resource}
          type={type}
          user={user}
          handleDelete={handleDelete}
        />
      )}
    </Stack>
  );
}

export function ResourceItemFooter({ resource }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        pt: 1.5,
        mt: 2,
      }}
    >
      {/* Left side - stats */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title="Publication date">
          <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
        </Tooltip>
        {resource?.zenodo?.metadata?.publication_date && (
          <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
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
          <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
            (v.{resource?.zenodo?.metadata?.version})
          </Typography>
        )}
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Downloads on Zenodo">
          <DownloadIcon sx={{ fontSize: "1.1rem" }} />
        </Tooltip>
        <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
          {resource?.zenodo?.stats?.downloads}
        </Typography>
        <Tooltip title="Views on Zenodo">
          <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
        </Tooltip>
        <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
          {resource?.zenodo?.stats?.views}
        </Typography>
      </Stack>

      {/* Right side - GraspOS logo */}
      <Stack direction="row" alignItems="center">
        <ResourceItemCommunities resource={resource} />
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

export function ResourceItemContent({ resource }) {
  return (
    <>
      <Stack direction={"row"} spacing={2} sx={{ pb: 2 }}>
        <Typography
          variant="subtitle"
          sx={{
            variant: "paragraph",
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
          borderColor: !resource?.approved ? '#FFD700' : '#e0dfdf',
          backgroundColor: !resource?.approved ? '#FFFDE7' : '#f8faff',
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
          <ResourceItemContent resource={resource} />
        </CardContent>
        <CardContent
          sx={{
            paddingBottom: "8px !important",
            pt: 0.5,
          }}
        >
          <ResourceItemFooter resource={resource} />
        </CardContent>
      </Card>
    </Grid>
  );
}
