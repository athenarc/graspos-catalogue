import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(`auth/login`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["tools"]);
      queryClient.invalidateQueries(["services"]);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.patch(`user`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(`register`, data);
    },
  });
}

export function useUserResetPassword() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.patch(`user/reset`, data);
    },
  });
}

export function useUserInformation(token) {
  return useQuery({
    queryKey: ["user"],
    retry: false,
    enabled: !!token,
    queryFn: () => axiosInstance.get(`user`),
  });
}

export function useUserUsername(userId, user) {
  return useQuery({
    queryKey: ["user-username-" + userId],
    retry: false,
    enabled: !!user,
    queryFn: () => axiosInstance.get(`user/${userId}`),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    retry: false,
    queryFn: () => axiosInstance.get(`user/users`, {}),
  });
}

export function useVerifyEmail(token) {
  return useQuery({
    queryKey: ["verify", token],
    retry: false,
    enabled: !!token,
    queryFn: () => axiosInstance.get(`register/verify/${token}`),
  });
}

export function useResetPassword(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(`register/reset-password`, data);
    },
    onSuccess: () => {},
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(`register/forgot-password`, data);
    },
    onSuccess: () => {},
  });
}
