import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import {
  useDeleteDataset,
  useDeleteResource,
  useUpdateDataset,
  useUpdateResource,
  useUserUsername,
} from "../queries/data";

export default function Resource({ resource, user, type }) {
  const deleteDatasest = useDeleteDataset();
  const deleteResource = useDeleteResource();
  const updateDataset = useUpdateDataset(resource._id);
  const updateResource = useUpdateResource(resource._id);
  const ownerUsername = useUserUsername(resource?.owner);
  let query = null;

  function handleDelete(id) {
    if (type === "Resource") {
      query = deleteResource;
    } else {
      query = deleteDatasest;
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
    if (type === "Resource") {
      query = updateResource;
    } else {
      query = updateDataset;
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
    <TableRow key={resource._id}>
      <TableCell>
        <Typography>{resource.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{type}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.description}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.tags}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.license}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.organization}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.visibility}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.source}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.version}</Typography>
      </TableCell>
      {/* <TableCell>
        <Typography>{resource.authors}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.api_url}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.api_url_instructions}</Typography>{" "}
      </TableCell>
      <TableCell>
        <Typography>{resource.documentation_url}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{resource.contact_person}</Typography>{" "}
      </TableCell>
      <TableCell>
        <Typography>{resource.contact_person_email}</Typography>{" "}
      </TableCell> */}
      {user?.super_user && (
        <TableCell sx={{ textAlign: "right" }}>
          {resource.approved ?? (
            <>
              <IconButton
                color="primary"
                onClick={() => {
                  handleUpdate(true);
                }}
              >
                <Check />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  handleUpdate(false);
                }}
              >
                <ClearIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      )}
      {user?.super_user && (
        <TableCell>{ownerUsername?.data?.data?.username}</TableCell>
      )}
      <TableCell sx={{ textAlign: "right" }}>
        <IconButton
          color="error"
          onClick={() => {
            handleDelete(resource._id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
