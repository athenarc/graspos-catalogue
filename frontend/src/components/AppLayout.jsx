import { useEffect, useState } from "react";
import { useUserInformation } from "../queries/data";
import MenuBar from "./MenuBar";
import Register from "./Register";
import { Outlet } from "react-router-dom";
import useWindowDimensions from "./WindowDimensions";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import BaseLayout from "./BaseLayout";

export default function AppLayout() {
  const { handleLogout, token, handleLogin } = useAuth();

  const { height } = useWindowDimensions();
  const [location, setLocation] = useState("login");

  function handleSetLocation(location) {
    setLocation(location);
  }

  return (
    <>
      {token ? (
        <>
          <BaseLayout height={height} handleLogout={handleLogout} />
        </>
      ) : (
        <>
          {location == "register" ? (
            <Register handleSetLocation={handleSetLocation} />
          ) : (
            <Login
              handleSetLocation={handleSetLocation}
              handleLogin={handleLogin}
            />
          )}
        </>
      )}
    </>
  );
}
