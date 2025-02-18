import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar";
import { useUserInformation } from "../queries/data";
import { useEffect } from "react";

export default function BaseLayout({ height, handleLogout }) {
  const userInformation = useUserInformation();
  useEffect(() => {
    if (userInformation?.error && userInformation?.error?.status == 401) {
      handleLogout()
    }
  }, [userInformation]);
  return (
    <>
      <MenuBar user={userInformation?.data?.data} handleLogout={handleLogout} />
      <Outlet context={{ user: userInformation?.data?.data, height: height }} />
    </>
  );
}
