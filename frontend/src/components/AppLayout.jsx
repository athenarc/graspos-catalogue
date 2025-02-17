import { useEffect, useState } from "react";
import { useUserInformation } from "../queries/data";
import MenuBar from "./MenuBar";
import Register from "./Register";
import { Outlet } from "react-router-dom";
import useWindowDimensions from "./WindowDimensions";
import { useAuth } from "./AuthContext";
import Login from "./Login";

export default function AppLayout() {
  const { user, handleLogout, token, handleUser } = useAuth();
  const userInformation = useUserInformation();
  const { height } = useWindowDimensions();
  const [location, setLocation] = useState("login");
  function handleSetLocation(location) {
    setLocation(location);
  }
  useEffect(() => {
    handleUser(userInformation?.data);
  }, [userInformation?.data, user]);

  return (
    <>
      {token ? (
        <>
          <MenuBar user={user} handleLogout={handleLogout} />
          <Outlet context={{ user: user, height: height }} />
        </>
      ) : (
        <>
          {location == "register" ? (
            <Register handleSetLocation={handleSetLocation} />
          ) : (
            <Login handleSetLocation={handleSetLocation} />
          )}
        </>
      )}
    </>
  );
}
