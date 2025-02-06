import { Button, Chip, Grid2 as Grid } from "@mui/material";
import logo from "../assets/graspos-logo.png";

export default function MenuBar({ handleLogout, user }) {
  return (
    <Grid
      container
      spacing={1}
      display="flex"
      justifyContent="center"
      sx={{ backgroundColor: "white" }}
    >
      <Grid size={4} sx={{ margin: "auto", textAlign: "left" }}>
        <Button href="https://graspos.eu/" target="_blank">
          <img src={logo} alt="GraspOS-Logo" width={130} height={70} />
        </Button>
      </Grid>
      <Grid size={4} sx={{ margin: "auto" }}></Grid>
      <Grid size={4} sx={{ textAlign: "right", margin: "auto" }}>
        <Button variant="outlined" sx={{ mr: 1 }}>
          Profile
        </Button>
        <Button variant="outlined" sx={{ mr: 1 }} onClick={handleLogout}>
          Logout
        </Button>

        <Chip label={user?.username?.toUpperCase()} sx={{ mr: 2 }}></Chip>
      </Grid>
    </Grid>
  );
}
