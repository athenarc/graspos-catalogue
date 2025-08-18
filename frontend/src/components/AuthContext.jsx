import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useUserInformation } from "../queries/data";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // ---- STATE ----
  const getTokenFromStorage = () => {
    try {
      const t = localStorage.getItem("token");
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState(getTokenFromStorage());
  const [user, setUser] = useState(null);

  const isAuthenticated = !!token && !!user;

  const userInformation = useUserInformation(token);

  // ---- SAFE LOGOUT ----
  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");

    setTimeout(() => {
      queryClient.invalidateQueries(["datasets"]);
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["tools"]);
      queryClient.invalidateQueries(["services"]);
    }, 100);
  }, [queryClient]);

  // ---- LOGIN ----
  const handleLogin = useCallback(
    (data) => {
      if (!data?.access_token) return;
      localStorage.setItem("token", JSON.stringify(data.access_token));
      setToken(data.access_token);
      // user θα φορτωθεί από useUserInformation effect
      setTimeout(() => {
        queryClient.invalidateQueries(["datasets"]);
        queryClient.invalidateQueries(["documents"]);
        queryClient.invalidateQueries(["tools"]);
        queryClient.invalidateQueries(["services"]);
      }, 100);
    },
    [queryClient]
  );

  // ---- UPDATE USER FROM API ----
  useEffect(() => {
    if (token && userInformation?.data?.data) {
      setUser(userInformation.data.data);
    }
  }, [userInformation, token]);

  // ---- TOKEN EXPIRY MONITOR ----
  useEffect(() => {
    if (!token) return;

    let timer;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = payload.exp * 1000; // ms
      const now = Date.now();
      const timeout = expiresAt - now;

      if (timeout <= 0) {
        handleLogout();
      } else {
        timer = setTimeout(() => {
          handleLogout();
        }, timeout);
      }
    } catch (err) {
      // αν το JWT είναι κατεστραμμένο
      handleLogout();
    }

    return () => clearTimeout(timer);
  }, [token, handleLogout]);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
