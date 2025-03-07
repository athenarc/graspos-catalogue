import React, { createContext, useState, useContext, useEffect } from "react";
import { useUserInformation } from "../queries/data";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      const token = JSON.parse(localStorage.getItem("token"));
      return token;
    }
    return null;
  };

  const getUser = () => {
    const userString = localStorage.getItem("user");
    if (typeof userString !== "undefined") {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const userInformation = useUserInformation(token);

  useEffect(() => {
    if (token && userInformation?.data?.data) {
      localStorage.setItem("user", JSON.stringify(userInformation?.data?.data));
      setUser(userInformation?.data?.data);
    }
    console.log("useeffect");
  }, [userInformation, token]);

  const handleLogin = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    localStorage.setItem("user", JSON.stringify(userInformation?.data?.data));
    setToken(data);
    setUser(userInformation?.data?.data);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
