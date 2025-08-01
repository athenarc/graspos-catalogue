import { Outlet, useParams } from "react-router-dom";
import MenuBar from "./MenuBar";
import ResourcesGridLayout from "../Resources/Layout";
export default function BaseLayout({ handleLogout, user, handleLogin }) {
  const { resourceId } = useParams();
  return (
    <>
      <MenuBar user={user} handleLogout={handleLogout} />
      {!resourceId && <ResourcesGridLayout user={user} />}

      <Outlet context={{ user: user, handleLogin: handleLogin }} />
    </>
  );
}
