import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import AppLayout from "./components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useToken from "./useToken";
import Profile from "./components/Profile";
import Resources from "./components/Resources";

function App() {
  const { token, setToken } = useToken();

  function handleLogout() {
    setToken(null);
  }
  function handleSetToken(token) {
    setToken(token);
  }
  const queryClient = new QueryClient();
  if (!token) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Login handleSetToken={handleSetToken} />}
            ></Route>
            <Route
              path="/register"
              element={<Register handleSetToken={handleSetToken} />}
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout
                handleLogout={handleLogout}
                handleSetToken={handleSetToken}
              />
            }
          >
            <Route path="profile" element={<Profile />}></Route>
            <Route path="resources" element={<Resources />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
