import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext";
import AppLayout from "./components/AppLayout";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import ProfileForm from "./components/Forms/ProfileForm";
import DatasetForm from "./components/Forms/DatasetForm";
import DocumentForm from "./components/Forms/DocumentForm";
import ToolForm from "./components/Forms/ToolForm";
import ZenodoForm from "./components/Forms/ZenodoForm";
import UsersPanelForm from "./components/Forms/UsersForm";
import ResourcesView from "./components/ZenodoUpdatesModal";
import ResourceDetails from "./components/ResourceDetails";
import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<AppLayout />}>
          <Route path="resource/:resourceId" element={<ResourceDetails />} />
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
  const queryClient = new QueryClient();

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
