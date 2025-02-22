import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import {
  useDeleteDataset,
  useUpdateDataset,
  useUserUsername,
} from "../queries/data";

export default function Resource({ resource, user }) {
  const deleteDatasest = useDeleteDataset();
  const updateDataset = useUpdateDataset(resource._id);
  const owenerUsername = useUserUsername(resource?.owner);

  function handleDelete(dataset_id) {
    deleteDatasest.mutate(
      { dataset_id },
      {
        onSuccess: (data) => {},
        onError: (e) => {},
      }
    );
  }
  function handleUpdate(approved) {
    updateDataset.mutate(
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
      <TableCell>
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
      </TableCell>
      {user?.super_user && (
        <>
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
          <TableCell>{owenerUsername?.data?.data?.username}</TableCell>
        </>
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
