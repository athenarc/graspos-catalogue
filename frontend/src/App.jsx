import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "@fontsource/montserrat/400.css";
import "./App.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext";
import AppLayout from "./components/AppLayout";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import ProfileForm from "./components/Forms/ProfileForm";
import UsersPanelForm from "./components/Forms/UsersForm";
import UpdatesModal from "./components/ZenodoUpdatesModal";
import { ResourcePage } from "./components/Resources/ResourcesGrid/ResourcePage";
import { queryClient } from "./queries/queryClient";
import ResourceForm from "./components/Forms/ResourceForm";

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<AppLayout />}>
          <Route path="datasets/:resourceId" element={<ResourcePage />} />
          <Route path="tools/:resourceId" element={<ResourcePage />} />
          <Route path="documents/:resourceId" element={<ResourcePage />} />
          <Route path="services/:resourceId" element={<ResourcePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="profile" element={<div />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="users" element={<UsersPanelForm />} />
          <Route path="resource/add" element={<ResourceForm />} />
          <Route path="zenodo/updates" element={<UpdatesModal />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="zenodo/updates" element={<UpdatesModal />} />
          <Route path="users" element={<UsersPanelForm />} />
          <Route path="resource/add" element={<ResourceForm />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
