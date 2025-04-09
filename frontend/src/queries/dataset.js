import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `dataset/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}

export function useDatasets(filters = []) {
  return useQuery({
    queryKey: ["datasets", filters], // The query key will trigger a refetch when filters change
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      filters.forEach((license) => {
        params.append("license", license); // Append each filter to the URL params
      });

      const response = await axiosInstance.get("dataset", {
        params, // Send filters as query parameters
      });

      return response.data; // Ensure we're returning the data part of the response
    },
    enabled: true, // Only run the query if filters are provided
  });
}

export function useDatasetLicenses(enabled) {
  return useQuery({
    queryKey: ["dataset-licenses"],
    retry: false,
    enabled: enabled,
    queryFn: () => axiosInstance.get(`dataset/licenses`),
  });
}

export function useDataset(datasetId) {
  return useQuery({
    queryKey: ["dataset-" + String(datasetId)],
    retry: false,
    queryFn: () => axiosInstance.get(`dataset/${datasetId}`),
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
