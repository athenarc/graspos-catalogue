import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const [token, setToken] = useState(null);

  function handleLogout() {
    setToken(null);
  }
  const queryClient = new QueryClient();
  if (!token) {
    return (
      <QueryClientProvider client={queryClient}>
        <Login setToken={setToken} />
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<AppLayout handleLogout={handleLogout} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
