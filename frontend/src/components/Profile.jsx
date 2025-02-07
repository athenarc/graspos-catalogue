import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useOutletContext } from "react-router-dom";

export default function Profile() {
  const { user } = useOutletContext();
  console.log(user);
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
      <CardHeader
        title="My profile"
        sx={{ backgroundColor: "#338BCB", color: "white" }}
      >
        Login
      </CardHeader>
      <CardContent>
        <Table>
          <TableRow>
            <TableCell>Username: </TableCell>
            <TableCell colSpan={2}> {user?.username}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name: </TableCell>
            <TableCell> {user?.first_name}</TableCell>
            <TableCell>
              <IconButton>
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last Name: </TableCell>
            <TableCell> {user?.last_name}</TableCell>
            <TableCell>
              <IconButton>
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email: </TableCell>
            <TableCell> {user?.email}</TableCell>
            <TableCell>
              <IconButton>
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Organization: </TableCell>
            <TableCell> {user?.organization}</TableCell>
            <TableCell>
              <IconButton>
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </Table>
      </CardContent>
      <CardActions>
        <Button disabled={true} variant="contained" onClick={(e) => submitLogin(e)}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
}
