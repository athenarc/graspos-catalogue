import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Profile() {
  const { user } = useOutletContext();
  const [editForm, setEditForm] = useState();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = (data) => console.log(data);
  function handleEditForm() {
    setEditForm(!editForm);
  }
  return (
    <Card
      p={2}
      sx={{
        height: "auto",
        margin: "auto",
        marginTop: "10vh",
        width: "40%",
        borderRadius: "10px",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          title="My profile"
          sx={{ backgroundColor: "#338BCB", color: "white" }}
        >
          Login
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Username: </TableCell>
                <TableCell colSpan={2}>{user?.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name: </TableCell>
                <TableCell>
                  {editForm ? (
                    <TextField
                      {...register("first_name")}
                      defaultValue={user?.first_name}
                    />
                  ) : (
                    <Typography>{user?.first_name}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleEditForm}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Name: </TableCell>
                <TableCell>
                  <TextField
                    {...register("last_name", { defaultValue: user?.last_name })}
                  />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email: </TableCell>
                <TableCell>
                  <TextField
                    {...register("email", { defaultValue: user?.email })}
                    defaultValue={user?.email}
                  />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Organization: </TableCell>
                <TableCell>
                  <TextField
                    {...register("organization")}
                    defaultValue={user?.organization}
                  />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
