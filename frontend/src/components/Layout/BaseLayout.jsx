import { Outlet, useLocation, useParams } from "react-router-dom";
import MenuBar from "./MenuBar";
import ResourcesGridLayout from "./ResourcesLayout";
import { Box, Typography } from "@mui/material";
import Footer from "./Footer";

export default function BaseLayout({ handleLogout, user, handleLogin }) {
  const { resourceUniqueSlug } = useParams();
  const location = useLocation();
  const hasDrawer = !resourceUniqueSlug && location?.pathname === "/";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <MenuBar user={user} handleLogout={handleLogout} />
        <Box sx={{ flexGrow: 1, overflow: "auto", paddingBottom: "100px" }}>
          {hasDrawer && (
            <ResourcesGridLayout user={user} />
          )}
          <Outlet context={{ user: user, handleLogin: handleLogin }} />
        </Box>
        <Footer hasDrawer={hasDrawer} />
      </Box>
    </>
  );
}
