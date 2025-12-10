import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useUpdates, useUpdateResources } from "@queries/update";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CloseIcon from "@mui/icons-material/Close";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Notification from "@helpers/Notification";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function UpdateRecords({ update }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>{update?.user_id?.username ?? "System Update"}</TableCell>
        <TableCell>
          {update?.source === "Zenodo" && (
            <Link to={"https://zenodo.org"} target="_blank">
              {update?.source}
            </Link>
          )}
          {update?.source === "OpenAIRE" && (
            <Link to={"https://www.openaire.eu/"} target="_blank">
              {update?.source}
            </Link>
          )}
        </TableCell>
        <TableCell>{update?.updates.length}</TableCell>
        <TableCell>
          {new Date(update?.created_at)
            .toISOString()
            .replace("T", " ")
            .slice(0, 19)}
        </TableCell>
        <TableCell align="right">
          {update?.updates.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="nested table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Previous version</TableCell>
                  <TableCell>New version</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {update?.updates?.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {detail?.zenodo?.title ||
                        detail?.openaire?.metadata?.name}
                    </TableCell>
                    <TableCell>{detail?.old_version}</TableCell>
                    <TableCell>{detail?.new_version}</TableCell>
                    <TableCell align="center">
                      {detail?.status?.toLowerCase() === "up to date" && (
                        <Tooltip title="Resource is up to date">
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </Tooltip>
                      )}
                      {detail?.status?.toLowerCase() === "error" && (
                        <Tooltip title="Error updating resource">
                          <ErrorIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                      {detail?.status?.toLowerCase() === "updated" && (
                        <Tooltip title="Resource updated successfully">
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function UpdatesTable({ updates }) {
  return (
    <Table sx={{ backgroundColor: "#FFF" }}>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Update Source</TableCell>
          <TableCell>Resources Checked</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {updates?.data?.data?.length == 0 && (
          <TableRow key={"no-data"}>
            <TableCell colSpan={4} sx={{ textAlign: "center" }}>
              No updates found!
            </TableCell>
          </TableRow>
        )}
        {updates?.data?.data?.map((update) => (
          <UpdateRecords key={update?._id} update={update} />
        ))}
      </TableBody>
    </Table>
  );
}

export default function UpdatesModal() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  function handleClose() {
    navigate(-1);
  }
  const updates = useUpdates();
  const updateResources = useUpdateResources();

  function handleZenodoUpdate() {
    updateResources.mutate(
      {},
      {
        onSuccess: (data) => {
          let message = "Resources updated successfully.";
          if (data?.data?.openaire) {
            message = `${data?.data?.openaire?.detail}. ` || message;
          }
          setMessage(message);
          if (data?.data?.zenodo) {
            message += ` ${data?.data?.zenodo?.detail || ""}`;
          }
          setMessage(message);
        },
        onError: (error) => {
          setMessage(
            error?.response?.data?.detail?.message ||
              error?.response?.data?.detail ||
              "An error occurred while updating Zenodo resources."
          );
        },
      }
    );
  }
  return (
    user && (
      <Dialog onClose={handleClose} open={true} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Resource updates
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <DialogContent sx={{ p: 2 }}>
          <UpdatesTable updates={updates} />
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            disabled={updateResources?.isPending}
            loading={updateResources?.isPending}
            onClick={() => handleZenodoUpdate()}
            endIcon={<SystemUpdateAltIcon />}
            loadingPosition="end"
            sx={{ backgroundColor: "#20477B" }}
          >
            Update resources
          </Button>
        </DialogActions>
        {(updateResources?.isSuccess || updateResources?.isError) && (
          <Notification
            requestStatus={updateResources?.status}
            message={message}
          />
        )}
      </Dialog>
    )
  );
}
