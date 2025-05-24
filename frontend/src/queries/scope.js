import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useScopes(field, enabled) {
  return useQuery({
    queryKey: ["scopes", field],
    retry: false,
    queryFn: () => axiosInstance.get(`/scope/`).then((res) => res),
  });
}
