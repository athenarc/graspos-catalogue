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

export function useDocuments(filters = {}) {
  return useQuery({
    queryKey: ["documents", filters],
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      // Loop through each filter and append key-value pairs to params
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object (like "license"), loop through its properties
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue === true) {
              params.append(key.replace("licenses", "license"), subKey); // Append the subKey as a value if it's true
            }
          });
        } else if (typeof value === "boolean" || value) {
          // If value is boolean or truthy (like "graspos")
          params.append(key, value);
        }
      });

      const response = await axiosInstance.get("document", { params });

      return response.data;
    },
    enabled: true,
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
