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
import DatasetForm from "./components/Resources/Datasets/DatasetForm";
import DocumentForm from "./components/Resources/Documents/DocumentForm";
import ToolForm from "./components/Resources/Tools/ToolForm";
import ZenodoForm from "./components/Forms/ZenodoForm";
import UsersPanelForm from "./components/Forms/UsersForm";
import ResourcesView from "./components/ZenodoUpdatesModal";
import { ResourcePage } from "./components/Resources/ResourceTemplate/ResourcePage";
import { queryClient } from "./queries/queryClient";

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
          <Route path="login" element={<LoginForm />} />
          <Route path="profile" element={<div />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="users" element={<UsersPanelForm />} />
          <Route path="dataset/add" element={<DatasetForm />} />
          <Route path="document/add" element={<DocumentForm />} />
          <Route path="tool/add" element={<ToolForm />} />
          <Route path="zenodo/add" element={<ZenodoForm />} />
          <Route path="zenodo/updates" element={<ResourcesView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="zenodo/updates" element={<ResourcesView />} />
          <Route path="users" element={<UsersPanelForm />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename="catalogue">
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
