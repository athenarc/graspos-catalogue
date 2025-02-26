import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar";

export default function BaseLayout({ handleLogout, user }) {
  return (
    <>
      <MenuBar user={user} handleLogout={handleLogout} />
      <Outlet context={{ user: user }} />
    </>
  );
}
