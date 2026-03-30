import { useAuth } from "../AuthContext";
import BaseLayout from "./BaseLayout";
import Footer from "@components/Layout/Footer";

export default function AppLayout() {
  const { handleLogin, handleLogout, user } = useAuth();
  return (
    <>
      <BaseLayout
        user={user}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
      />
    </>
  );
}
