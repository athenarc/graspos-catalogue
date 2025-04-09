import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `document/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });
}

export function useDocuments(filters = []) {
  return useQuery({
    queryKey: ["documents", filters], // The query key will trigger a refetch when filters change
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      filters.forEach((license) => {
        params.append("license", license); // Append each filter to the URL params
      });

      const response = await axiosInstance.get("document", {
        params, // Send filters as query parameters
      });

      return response.data; // Ensure we're returning the data part of the response
    },
    enabled: true, // Only run the query if filters are provided
  });
}

export function useDocumentLicenses(enabled) {
  return useQuery({
    queryKey: ["document-licenses"],
    retry: false,
    enabled: enabled,
    queryFn: () => axiosInstance.get(`document/licenses`),
  });
}

export function useDocument(documentId) {
  return useQuery({
    queryKey: ["document-" + String(documentId)],
    retry: false,
    queryFn: () => axiosInstance.get(`document/${documentId}`),
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
