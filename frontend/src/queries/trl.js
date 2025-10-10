import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useTrls(field) {
  return useQuery({
    queryKey: ["trls", field],
    retry: false,
    queryFn: () => axiosInstance.get(`trl`).then((res) => res),
  });
}
