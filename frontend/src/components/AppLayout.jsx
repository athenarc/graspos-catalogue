import { useEffect } from "react";
import { useUserInformation } from "../queries/data";
import MenuBar from "./MenuBar";
import useToken from "../useToken";
import { Outlet } from "react-router-dom";
import useWindowDimensions from "./WindowDimensions";

export default function AppLayout({ handleLogout }) {
  const userInformation = useUserInformation();
  const { user, setUser } = useToken();
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    setUser(userInformation?.data);
  }, [userInformation?.data, user]);

  return (
    <>
      <MenuBar user={user} handleLogout={handleLogout} />
      <Outlet context={{ user: user, height: height }} />
    </>
  );
}
