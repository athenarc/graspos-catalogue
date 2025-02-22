import { useAuth } from "./AuthContext";
import BaseLayout from "./BaseLayout";
import { useUserInformation } from "../queries/data";
import { useEffect } from "react";

export default function AppLayout() {
  const { handleLogout } = useAuth();
  const userInformation = useUserInformation();

  useEffect(() => {
    if (
      userInformation?.error?.status == 401 ||
      userInformation?.error?.status == 404
    ) {
      handleLogout();
    }
  }, [userInformation]);

  return (
    userInformation?.isFetched && (
      <BaseLayout
        user={userInformation?.data?.data}
        handleLogout={handleLogout}
      />
    )
  );
}
