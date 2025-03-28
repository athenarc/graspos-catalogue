import {
  Button,
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
} from "@mui/material";
import { useUpdates } from "../queries/update";
import { useUpdateZenodo } from "../queries/zenodo";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useOutletContext } from "react-router-dom";
import Notification from "./Notification";
import { useState } from "react";

function UpdatesTable({ updates }) {
  return (
    <Table sx={{ backgroundColor: "#FFF" }}>
      <TableHead>
        <TableRow>
          <TableCell variant="head">Resource Title</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>User</TableCell>
          <TableCell>Previous Zenodo ID</TableCell>
          <TableCell>Current Zenodo ID</TableCell>
          <TableCell>Updated On</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {updates?.data?.data?.length == 0 && (
          <TableRow key={"no-data"}>
            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
              No updates found!
            </TableCell>
          </TableRow>
        )}
        {updates?.data?.data?.map((update) => (
          <TableRow key={update?._id}>
            <TableCell>{update?.zenodo_id?.title}</TableCell>
            <TableCell>
              {update?.zenodo_id?.metadata?.resource_type?.title}
            </TableCell>
            <TableCell>{update?.user_id?.username}</TableCell>
            <TableCell>{update?.old_version}</TableCell>
            <TableCell>{update?.new_version}</TableCell>
            <TableCell>
              {new Date(update?.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function UpdatesModal() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useOutletContext();
  function handleClose() {
    navigate("..");
  }
  const updates = useUpdates();
  const updateZenodo = useUpdateZenodo();

  function handleZenodoUpdate() {
    updateZenodo.mutate(
      {},
      {
        onSuccess: (data) => {
          setMessage(data?.data?.detail);
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
        },
      }
    );
  }
  return (
    user && (
      <Dialog onClose={handleClose} open={true} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Resource Updates From Zenodo
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
            disabled={updateZenodo?.isPending}
            loading={updateZenodo?.isPending}
            onClick={() => handleZenodoUpdate()}
            endIcon={<SystemUpdateAltIcon />}
            loadingPosition="end"
            sx={{ backgroundColor: "#20477B" }}
          >
            Update Resources
          </Button>
        </DialogActions>
        {(updateZenodo?.isSuccess || updateZenodo?.isError) && (
          <Notification
            requestStatus={updateZenodo?.status}
            message={message}
          />
        )}
      </Dialog>
    )
  );
}
