import React, { createContext, useState, useContext } from "react";
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

  const [token, setToken] = useState(getToken());

  const handleLogin = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setToken(data);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
