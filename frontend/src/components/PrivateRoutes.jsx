import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthenticatedRoutes = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const NonAuthenticatedRoutes = () => {
  const { token } = useAuth();
  return !token ? <Outlet /> : <Navigate to="/" replace />;
};
const AnonymousRoutes = () => {
  return <Outlet />
}
export { AuthenticatedRoutes, NonAuthenticatedRoutes, AnonymousRoutes };
