import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar";
import { useUserInformation } from "../queries/data";

export default function BaseLayout({ height, handleLogout }) {
  const userInformation = useUserInformation();
  return (
    <>
      <MenuBar user={userInformation?.data} handleLogout={handleLogout} />
      <Outlet context={{ user: userInformation?.data, height: height }} />
    </>
  );
}
