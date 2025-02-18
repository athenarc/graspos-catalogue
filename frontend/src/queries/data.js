import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";
export function useLogin() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(`auth/login`, data);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `user`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
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
  });
}
