import { Button, Grid2 as Grid, Stack } from "@mui/material";
import logo from "../assets/graspos-logo.png";
import { Link, useNavigate } from "react-router-dom";
import UserDropDownMenu from "./UserDropDownMenu";

export default function MenuBar({ handleLogout, user }) {
  const navigate = useNavigate();
  function handleProfile() {
    navigate("/profile");
  }
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
            <img src={logo} alt="GraspOS-Logo" width={110} height={60} />
          </Button>
        </Grid>
        <Grid size={4} sx={{ margin: "auto" }}></Grid>
        <Grid size={4} sx={{ textAlign: "right", margin: "auto" }}>
          <Stack direction="row" justifyContent="flex-end">
            <Link to={"resources"}>
              <Button variant="outlined" sx={{ mr: 1 }}>
                Resources
              </Button>
            </Link>
            <UserDropDownMenu
              user={user}
              handleProfile={handleProfile}
              handleLogout={handleLogout}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
