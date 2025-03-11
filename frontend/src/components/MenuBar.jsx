import { Box, Button, Grid2 as Grid, Typography, Stack } from "@mui/material";
import logo from "../assets/graspos-logo.png";
import { Link, useNavigate } from "react-router-dom";
import UserDropDownMenu from "./UserDropDownMenu";

export default function MenuBar({ handleLogout, user }) {
  const navigate = useNavigate();
  function handleProfile() {
    navigate("/profile");
  }
  return (
    <Grid
      component={Box}
      container
      spacing={1}
      justifyContent="center"
      sx={{
        backgroundColor: "#FFF",
        boxShadow:
          " rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;",
        width: "100%",
        position: "relative;",
        zIndex: "1202",
      }}
    >
      <Grid size={4} sx={{ margin: "auto", textAlign: "left" }}>
        <Button href="https://graspos.eu/" target="_blank" sx={{ p: 0 }}>
          <img src={logo} alt="GraspOS-Logo" width={110} height={60} />
        </Button>
      </Grid>
      <Grid size={4} sx={{ margin: "auto", textAlign: "center" }}></Grid>
      <Grid size={4} sx={{ textAlign: "right", margin: "auto" }}>
        <Stack direction="row" justifyContent="flex-end">
          {!user && (
            <Link to={"login"}>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Login
              </Button>
            </Link>
          )}
          {user && (
            <UserDropDownMenu
              user={user}
              handleProfile={handleProfile}
              handleLogout={handleLogout}
            />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
