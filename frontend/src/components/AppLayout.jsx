import useWindowDimensions from "./WindowDimensions";
import { useAuth } from "./AuthContext";
import BaseLayout from "./BaseLayout";

export default function AppLayout() {
  const { handleLogout } = useAuth();

  const { height } = useWindowDimensions();

  return <BaseLayout height={height} handleLogout={handleLogout} />;
}
