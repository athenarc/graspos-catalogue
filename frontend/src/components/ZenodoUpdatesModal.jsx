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
} from "@mui/material";
import { useUpdates } from "../queries/update";
import { useUpdateZenodo } from "../queries/zenodo";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CloseIcon from "@mui/icons-material/Close";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { useState } from "react";
import { useAuth } from "./AuthContext";

function UpdateRecords({ update }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>{update?.user_id?.username ?? "System Update"}</TableCell>

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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="nested table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Previous Version</TableCell>
                  <TableCell>New Version</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {update?.updates?.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail?.zenodo?.title}</TableCell>
                    <TableCell>{detail.old_version}</TableCell>
                    <TableCell>{detail.new_version}</TableCell>
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
          <TableCell></TableCell>
          <TableCell>Resources Updated</TableCell>
          <TableCell>Updated On</TableCell>
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
      <Dialog onClose={handleClose} open={true} fullWidth maxWidth="md">
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
