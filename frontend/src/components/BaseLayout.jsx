import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar";
import ResourcesGrid from "./ResourcesGrid";
export default function BaseLayout({ handleLogout, user, handleLogin }) {
  return (
    <>
      <MenuBar user={user} handleLogout={handleLogout} />
      <ResourcesGrid user={user} />
      <Outlet context={{ user: user, handleLogin: handleLogin }} />
    </>
  );
}
