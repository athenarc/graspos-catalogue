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

export function useUserInformation(token) {
  return useQuery({
    queryKey: ["user"],
    retry: false,
    enabled: !!token,
    queryFn: () => axiosInstance.get(`user`, {}),
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

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `document`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    retry: false,
    queryFn: () => axiosInstance.get(`document`),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `document/${document.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });
}

export function useUpdateDocument(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `document/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
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
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `dataset/${document.id}`
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
