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

export function useDatasets() {
  return useQuery({
    queryKey: ["datasets"],
    retry: false,
    queryFn: () => axiosInstance.get(`dataset/all`),
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
