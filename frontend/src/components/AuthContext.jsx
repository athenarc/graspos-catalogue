import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    var userToken = "";
    try {
      userToken = JSON.parse(tokenString);
    } catch (error) {
      return null;
    }
    return userToken;
  };

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());

  const handleLogin = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setToken(data);
  };

  const handleUser = (data) => {
    setUser(data);
  };
  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, handleLogin, handleLogout, handleUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
