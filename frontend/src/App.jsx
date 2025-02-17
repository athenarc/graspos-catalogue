import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./components/Profile";
import Resources from "./components/Resources";
import { AuthProvider } from "./components/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="profile" element={<Profile />}></Route>
              <Route path="resources" element={<Resources />}></Route>
              <Route path="*" exact element={<Navigate to={"/"} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
