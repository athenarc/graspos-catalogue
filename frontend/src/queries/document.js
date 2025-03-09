import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

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

export function useDocuments(user) {
  return useQuery({
    queryKey: ["documents"],
    retry: false,
    queryFn: () => axiosInstance.get(user ? `document/admin/` : `document`),
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
