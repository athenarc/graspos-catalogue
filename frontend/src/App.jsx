import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./components/Profile";
import Resources from "./components/Resources";
import { AuthProvider } from "./components/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import {
  AuthenticatedRoutes,
  NonAuthenticatedRoutes,
} from "./components/PrivateRoutes.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Form from "./components/Forms/Form.jsx";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<NonAuthenticatedRoutes />}>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
            </Route>
            <Route element={<AuthenticatedRoutes />}>
              <Route path="/" element={<AppLayout />}>
                <Route path="profile" element={<Profile />}></Route>
                <Route path="resources" element={<Resources />}>
                  <Route path="add" element={<Form />}></Route>
                </Route>
                <Route path="*" exact element={<Navigate to={"/"} />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
