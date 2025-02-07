import { Button, Chip, Grid2 as Grid } from "@mui/material";
import logo from "../assets/graspos-logo.png";
import { Link, Outlet, useOutletContext } from "react-router-dom";

export default function MenuBar({ handleLogout }) {
  // const { user } = useOutletContext();
  return (
    <>
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
        <Link to={"resources"}>
            <Button variant="outlined" sx={{ mr: 1 }}>
              Resources
            </Button>
          </Link>
          <Link to={"profile"}>
            <Button variant="outlined" sx={{ mr: 1 }}>
              Profile
            </Button>
          </Link>

          <Button variant="outlined" sx={{ mr: 2 }} onClick={handleLogout}>
            Logout
          </Button>

          {/* <Chip label={user?.username?.toUpperCase()} sx={{ mr: 2 }}></Chip> */}
        </Grid>
      </Grid>
      {/* <Outlet context={{ user: user }} /> */}
    </>
  );
}
