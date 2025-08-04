import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useUpdates() {
  return useQuery({
    queryKey: ["updates"],
    retry: false,
    queryFn: () => axiosInstance.get(`update`),
  });
}

export function useUpdateResources() {
  const queryClient = useQueryClient();
  return useMutation({
    queryKey: ["resources-update"],
    retry: false,
    mutationFn: (data) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `update/update`,
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
