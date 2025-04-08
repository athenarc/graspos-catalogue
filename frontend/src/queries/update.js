import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useUpdates() {
  return useQuery({
    queryKey: ["updates"],
    retry: false,
    queryFn: () =>
      axiosInstance.get(process.env.REACT_APP_BACKEND_HOST + `update/all`),
  });
}
