import { Outlet, useParams } from "react-router-dom";
import MenuBar from "./MenuBar";
import ResourcesGrid from "./ResourcesGrid";
export default function BaseLayout({ handleLogout, user, handleLogin }) {
  const { resourceId } = useParams();
  return (
    <>
      <MenuBar user={user} handleLogout={handleLogout} />
      {!resourceId && <ResourcesGrid user={user} />}

      <Outlet context={{ user: user, handleLogin: handleLogin }} />
    </>
  );
}
