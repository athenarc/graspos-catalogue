// App.jsx
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

import LoginForm from "@forms/LoginForm";
import RegisterForm from "@forms/RegisterForm";
import ProfileForm from "@forms/ProfileForm";
import UsersPanelForm from "@forms/UsersForm";
import ResourceForm from "@forms/ResourceForm";
import UpdatesModal from "./components/ResourceUpdatesModal";
import { ResourcePage } from "./components/Resources/ResourcesGrid/ResourcePage";
import { queryClient } from "@queries/queryClient";

import EmailVerificationPage from "@helpers/EmailVerification";
import PasswordResetModal from "@helpers/PasswordResetToken";
import ForgotPasswordModal from "@helpers/PasswordResetEmail";
import ResetPasswordForm from "@forms/ResetPasswordForm";

// ----------------------
// Helper route wrappers
// ----------------------

function ProtectedRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function GuestRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? element : <Navigate to="/" replace />;
}

// ----------------------
// Main Routes
// ----------------------

function AppRoutes() {
  const location = useLocation();
  const state = location?.state;
  const backgroundLocation = state?.backgroundLocation;

  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {/* Primary routing layer */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<AppLayout />}>
          {/* Public resources */}
          <Route
            path="datasets/:resourceUniqueName"
            element={<ResourcePage />}
          />
          <Route path="tools/:resourceUniqueName" element={<ResourcePage />} />
          <Route
            path="documents/:resourceUniqueName"
            element={<ResourcePage />}
          />
          <Route
            path="services/:resourceUniqueName"
            element={<ResourcePage />}
          />

          {/* Guest-only routes */}
          <Route
            path="login"
            element={<GuestRoute element={<LoginForm />} />}
          />
          <Route
            path="register"
            element={<GuestRoute element={<RegisterForm />} />}
          />
          <Route
            path="mail/verify/:token"
            element={<GuestRoute element={<EmailVerificationPage />} />}
          />
          <Route
            path="password/reset/:token"
            element={<GuestRoute element={<PasswordResetModal />} />}
          />
          <Route
            path="reset"
            element={<GuestRoute element={<ForgotPasswordModal />} />}
          />

          {/* Authenticated routes */}
          <Route
            path="profile"
            element={<ProtectedRoute element={<ProfileForm />} />}
          />
          <Route
            path="profile/reset-password"
            element={<ProtectedRoute element={<ResetPasswordForm />} />}
          />
          <Route
            path="resource/add"
            element={<ProtectedRoute element={<ResourceForm />} />}
          />

          {user?.is_admin && (
            <>
              <Route
                path="users"
                element={<ProtectedRoute element={<UsersPanelForm />} />}
              />
              <Route
                path="zenodo/updates"
                element={<ProtectedRoute element={<UpdatesModal />} />}
              />
            </>
          )}

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>

      {/* Modal layer — shows dialogs over background page */}
      {backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={<GuestRoute element={<LoginForm />} />}
          />
          <Route
            path="/register"
            element={<GuestRoute element={<RegisterForm />} />}
          />
          <Route
            path="/mail/verify/:token"
            element={<GuestRoute element={<EmailVerificationPage />} />}
          />
          <Route
            path="/reset"
            element={<GuestRoute element={<ForgotPasswordModal />} />}
          />
          <Route
            path="/password/reset/:token"
            element={<GuestRoute element={<PasswordResetModal />} />}
          />
          <Route
            path="/profile/reset-password"
            element={<ProtectedRoute element={<ResetPasswordForm />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfileForm />} />}
          />
          <Route
            path="/zenodo/updates"
            element={<ProtectedRoute element={<UpdatesModal />} />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute element={<UsersPanelForm />} />}
          />
          <Route
            path="/resource/add"
            element={<ProtectedRoute element={<ResourceForm />} />}
          />
        </Routes>
      )}
    </>
  );
}

// ----------------------
// App Wrapper
// ----------------------

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
