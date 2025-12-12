import { Outlet, useParams } from "react-router-dom";
import MenuBar from "./MenuBar";
import ResourcesGridLayout from "../Resources/Layout";
import { Box } from "@mui/material";

export default function BaseLayout({ handleLogout, user, handleLogin }) {
  const { resourceUniqueName } = useParams();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <MenuBar user={user} handleLogout={handleLogout} />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {!resourceUniqueName && <ResourcesGridLayout user={user} />}
        <Outlet context={{ user: user, handleLogin: handleLogin }} />
      </Box>
    </Box>
  );
}
