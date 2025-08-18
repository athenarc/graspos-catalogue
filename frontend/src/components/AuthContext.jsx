import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useUserInformation } from "../queries/data";
import { useQueryClient } from "@tanstack/react-query";
import { setLogoutCallback } from "../queries/interceptor";

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
    localStorage.removeItem("refresh_token");

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
      localStorage.setItem("refresh_token", JSON.stringify(data.refresh_token));
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

  useEffect(() => {
    setLogoutCallback(handleLogout);
  }, [handleLogout]);

  // ---- UPDATE USER FROM API ----
  useEffect(() => {
    if (token && userInformation?.data?.data) {
      setUser(userInformation.data.data);
    }
  }, [userInformation, token]);

  // ---- TOKEN EXPIRY & AUTO REFRESH ----
  useEffect(() => {
    if (!token) return;

    let timer;

    const tryRefresh = async () => {
      try {
        const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
        if (!refreshToken) throw new Error("No refresh token");

        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Refresh failed");
        const data = await res.json();

        localStorage.setItem("token", JSON.stringify(data.access_token));
        setToken(data.access_token);
      } catch (err) {
        handleLogout(); // τελικό logout αν αποτύχει
      }
    };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = payload.exp * 1000; // ms
      const now = Date.now();
      const timeout = expiresAt - now;

      if (timeout <= 0) {
        tryRefresh();
      } else {
        timer = setTimeout(() => tryRefresh(), timeout);
      }
    } catch (err) {
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
