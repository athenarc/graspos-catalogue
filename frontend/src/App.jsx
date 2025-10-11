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
import { AuthProvider, useAuth } from "./components/AuthContext";
import AppLayout from "./components/Layout/AppLayout";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import ProfileForm from "./components/Forms/ProfileForm";
import UsersPanelForm from "./components/Forms/UsersForm";
import UpdatesModal from "./components/ResourceUpdatesModal";
import { ResourcePage } from "./components/Resources/ResourcesGrid/ResourcePage";
import { queryClient } from "./queries/queryClient";
import ResourceForm from "./components/Forms/ResourceForm";
import EmailVerificationPage from "@helpers/EmailVerification";

function AppRoutes() {
  const location = useLocation();
  const state = location?.state;
  const backgroundLocation = state?.backgroundLocation;
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<AppLayout />}>
          <Route path="datasets/:resourceId" element={<ResourcePage />} />
          <Route path="tools/:resourceId" element={<ResourcePage />} />
          <Route path="documents/:resourceId" element={<ResourcePage />} />
          <Route path="services/:resourceId" element={<ResourcePage />} />

          {!isAuthenticated && (
            <>
              <Route
                path="mail/verify/:token"
                element={<EmailVerificationPage />}
              />
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
            </>
          )}

          <Route path="profile" element={<ProfileForm />} />
          <Route path="users" element={<UsersPanelForm />} />
          <Route path="resource/add" element={<ResourceForm />} />
          <Route path="zenodo/updates" element={<UpdatesModal />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? <LoginForm /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <RegisterForm /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/mail/verify/:token"
            element={
              !isAuthenticated ? (
                <EmailVerificationPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/profile" element={<ProfileForm />} />
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
