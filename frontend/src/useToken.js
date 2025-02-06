import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken;
  };
  const getUser = () => {
    const userString = localStorage.getItem("user");
    if (typeof userString === 'undefined'){
      const user = JSON.parse(userString);
      return user;
    }
    return {}
  };
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  };
  const saveUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  return {
    setUser: saveUser,
    setToken: saveToken,
    token,
    user,
  };
}
