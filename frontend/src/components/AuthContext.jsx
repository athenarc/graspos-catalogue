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
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        return token;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const userInformation = useUserInformation(token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      setUser(null);
      setToken(null);
    }
    if (token && userInformation?.data?.data) {
      setUser(userInformation?.data?.data);
    }
  }, [userInformation, token]);

  const handleLogin = (data) => {
    localStorage.setItem("token", JSON.stringify(data?.access_token));
    localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token));
    setToken(data);
    setUser(userInformation?.data?.data);
    setTimeout(() => {
      queryClient.invalidateQueries(["datasets"]);
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["tools"]);
      queryClient.invalidateQueries(["services"]);
    }, 100);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    setTimeout(() => {
      queryClient.invalidateQueries(["datasets"]);
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["tools"]);
      queryClient.invalidateQueries(["services"]);
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
