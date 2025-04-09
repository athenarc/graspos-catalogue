import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `tool/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tools"]);
    },
  });
}

export function useTools(filters = []) {
  return useQuery({
    queryKey: ["tools", filters], // The query key will trigger a refetch when filters change
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      filters.forEach((license) => {
        params.append("license", license); // Append each filter to the URL params
      });

      const response = await axiosInstance.get("tool", {
        params, // Send filters as query parameters
      });

      return response.data; // Ensure we're returning the data part of the response
    },
    enabled: true, // Only run the query if filters are provided
  });
}

export function useToolLicenses(enabled) {
  return useQuery({
    queryKey: ["tool-licenses"],
    retry: false,
    enabled: enabled,
    queryFn: () => axiosInstance.get(`tool/licenses`),
  });
}

export function useTool(toolId) {
  return useQuery({
    queryKey: ["tool-" + String(toolId)],
    retry: false,
    queryFn: () => axiosInstance.get(`tool/${toolId}`),
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `tool/${document.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tools"]);
    },
  });
}

export function useUpdateTool(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `tool/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tools"]);
    },
  });
}
