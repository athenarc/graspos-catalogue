import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { useDatasets, useResources } from "../queries/data";
import Resource from "./Resource";

export default function Resources() {
  const datasets = useDatasets();
  const resources = useResources();
  const { user } = useOutletContext();

  return (
    <>
      <Grid
        container
        sx={{ height: "auto", margin: "auto", marginTop: "10vh", width: "90%" }}
      >
        <Grid size={12}>
          <Card>
            <CardHeader
              title="Resources"
              sx={{ backgroundColor: "#338BCB", color: "white" }}
            >
              Resources
            </CardHeader>
            <CardContent>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Licence</TableCell>
                      <TableCell>Organisation</TableCell>
                      <TableCell>Visibility</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Version</TableCell>
                      {/* <TableCell>Authors</TableCell>
                      <TableCell>API URL</TableCell>
                      <TableCell>API URL instructions</TableCell>
                      <TableCell>Documentation URL</TableCell>
                      <TableCell>Contact person</TableCell>
                      <TableCell>Contact person email</TableCell> */}
                      {user?.super_user && (
                        <>
                          <TableCell>Approval</TableCell>
                          <TableCell>Created By</TableCell>
                        </>
                      )}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {datasets?.data?.data?.map((dataset) => (
                      <Resource
                        type={"Dataset"}
                        resource={dataset}
                        key={dataset._id}
                        user={user}
                      />
                    ))}
                    {resources?.data?.data?.map((resource) => (
                      <Resource
                        type={"Resource"}
                        resource={resource}
                        key={resource._id}
                        user={user}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions sx={{ textAlign: "right" }}>
              <Button color="primary" component={Link} to="/resources/add">
                Add
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Outlet context={{ user: user }} />
    </>
  );
}
