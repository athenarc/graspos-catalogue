import { Box, Button, Grid2 as Grid, Stack } from "@mui/material";
import logo from "@assets/graspos_menu_logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserDropDownMenu from "../UserDropDownMenu";

export default function MenuBar({ handleLogout, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleProfile() {
    navigate("profile", { state: { backgroundLocation: location } });
  }
  function handleUsers() {
    navigate("users", { state: { backgroundLocation: location } });
  }
  function handleZenodoUpdates() {
    navigate("zenodo/updates", { state: { backgroundLocation: location } });
  }
  function handleAddResource() {
    navigate("resource/add", { state: { backgroundLocation: location } });
  }
  return (
    <Grid
      component={Box}
      container
      spacing={1}
      justifyContent="center"
      sx={{
        backgroundColor: "#20477B",
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;",
        width: "100%",
        position: "relative;",
        zIndex: "1202",
        px: 2,
        py: 1,
        minHeight: { xs: 56, sm: 64 }, // 7 units for mobile, 8 units for desktop
        display: "flex",
        padding: "12px 14px",
      }}
    >
      <Grid
        size={4}
        sx={{
          margin: "auto",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          height: "100%",
          py: 1,
        }}
      >
        <Link
          to="https://graspos-infra.athenarc.gr/"
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src={logo}
            alt="GraspOS-Logo"
            style={{
              height: "42px", // 6 spacing units (6 * 8px)
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>
      </Grid>
      <Grid size={4} sx={{ margin: "auto", textAlign: "center" }}></Grid>
      <Grid
        size={4}
        sx={{
          textAlign: "right",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <Link
            to={"https://zenodo.org/records/17339365"}
            target="_blank"
            state={{ backgroundLocation: location }}
          >
            <Button variant="outlined" sx={{ color: "#fff", border: "none" }}>
              Help
            </Button>
          </Link>
          {!user && (
            <Stack direction="row" spacing={1}>
              <Link to={"login"} state={{ backgroundLocation: location }}>
                <Button
                  variant="outlined"
                  sx={{ color: "#fff", border: "none" }}
                >
                  Login
                </Button>
              </Link>
            </Stack>
          )}
          {user && (
            <UserDropDownMenu
              user={user}
              handleProfile={handleProfile}
              handleUsers={handleUsers}
              handleLogout={handleLogout}
              handleZenodoUpdates={handleZenodoUpdates}
              handleAddResource={handleAddResource}
            />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
