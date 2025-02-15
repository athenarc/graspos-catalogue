import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useLogin() {
  return useMutation({
    mutationFn: ({ username, password }) => {
      return axiosInstance.post(`auth/login`, {
        username,
        password,
      });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `user`,
        data
      );
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `register`,
        data
      );
    },
  });
}

export function useUserInformation() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axiosInstance
        .get(`user`, {})
        .then(({ data }) => data)
        .catch((error) => error),
  });
}
