import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useZenodo() {
  return useMutation({
    queryKey: ["zenodo"],
    retry: false,
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `zenodo/search`,
        data
      );
    },
  });
}

export function useUpdateZenodo() {
  const queryClient = useQueryClient();
  return useMutation({
    queryKey: ["zenodo-update"],
    retry: false,
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `zenodo/update`,
        data
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["datasets"]);
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["tools"]);
      queryClient.invalidateQueries(["services"]);
    },
  });
}
