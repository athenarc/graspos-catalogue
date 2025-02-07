import {
  Card,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function Resources() {
  return (
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Licence</TableCell>
                  <TableCell>Organisation</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Authors</TableCell>
                  <TableCell>API URL</TableCell>
                  <TableCell>API URL instructions</TableCell>
                  <TableCell>Documentation URL</TableCell>
                  <TableCell>Contact person</TableCell>
                  <TableCell> Contact person email</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
