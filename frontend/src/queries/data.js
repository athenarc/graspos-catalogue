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

export function useUpdateUser() {
  const { token } = useToken();
  return useMutation({
    mutationFn: ({ data }) => {
      return axios.patch(process.env.REACT_APP_BACKEND_HOST + `user`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axios.post(process.env.REACT_APP_BACKEND_HOST + `register`, data);
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
        .catch((error) => error),
  });
}
