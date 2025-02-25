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
    retry: false,
    queryFn: () => axiosInstance.get(`user`, {}),
  });
}

export function useUserUsername(userId) {
  return useQuery({
    queryKey: ["user-username-" + userId],
    retry: false,
    queryFn: () => axiosInstance.get(`user/${userId}`),
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `resource`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
  });
}

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    retry: false,
    queryFn: () => axiosInstance.get(`resource`),
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resource) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `resource/${resource.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
  });
}

export function useUpdateResource(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `resource/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `dataset`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}

export function useDatasets() {
  return useQuery({
    queryKey: ["datasets"],
    retry: false,
    queryFn: () => axiosInstance.get(`dataset`),
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resource) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `dataset/${resource.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}

export function useUpdateDataset(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `dataset/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}
