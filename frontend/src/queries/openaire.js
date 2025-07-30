import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useOpenaire() {
  return useMutation({
    queryKey: ["openaire"],
    retry: false,
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `openaire/search`,
        data
      );
    },
  });
}