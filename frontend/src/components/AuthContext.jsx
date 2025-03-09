import React, { createContext, useState, useContext, useEffect } from "react";
import { useUserInformation } from "../queries/data";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      setUser(null);
      setToken(null);
    }
    if (token && userInformation?.data?.data) {
      localStorage.setItem("user", JSON.stringify(userInformation?.data?.data));
      setUser(userInformation?.data?.data);
    }
  }, [userInformation, token]);

  const handleLogin = (data) => {
    localStorage.setItem("token", JSON.stringify(data?.access_token));
    localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token));
    localStorage.setItem("user", JSON.stringify(userInformation?.data?.data));
    setToken(data);
    setUser(userInformation?.data?.data);
    queryClient.invalidateQueries(["documents", "datasets"]);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    queryClient.invalidateQueries(["documents", "datasets"]);
  };

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
