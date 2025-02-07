// import Card from '@mui/material/Card';

import { useUserInformation } from "../queries/data";
import MenuBar from "./MenuBar";
import useToken from "../useToken";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function AppLayout({ handleLogout, handleSetToken }) {
  const userInformation = useUserInformation();
  const { user, setUser } = useToken();

  useEffect(() => {
    if (userInformation?.data?.response?.status === 401) {
      handleSetToken(null);
    }
    setUser(userInformation?.data ?? null);
  }, [userInformation]);

  return (
    <>
      <MenuBar handleLogout={handleLogout} />
      <Outlet context={{ user: user }} />
    </>
  );
}
