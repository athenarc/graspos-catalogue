import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useToken from "../useToken";

export function useLogin() {
  return useMutation({
    mutationFn: ({ username, password }) => {
      return axios.post(process.env.REACT_APP_BACKEND_HOST + `auth/login`, {
        username,
        password,
      });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ username, password, email, first_name, last_name }) => {
      return axios.post(process.env.REACT_APP_BACKEND_HOST + `register`, {
        username,
        password,
        email,
        first_name,
        last_name
      });
    },
  });
}

export function useUserInformation() {
  const { token } = useToken();
  return useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios
        .get(process.env.REACT_APP_BACKEND_HOST + `user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data)
        .catch((error) => error)
  });
}
