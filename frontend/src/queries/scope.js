import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useScopes(field) {
  return useQuery({
    queryKey: ["scopes", field],
    retry: false,
    queryFn: () => axiosInstance.get(`scope`).then((res) => res),
  });
}

export function useScopesWithCount() {
  return useQuery({
    queryKey: ["scopes-with-count"],
    retry: false,
    queryFn: () =>
      axiosInstance
        .get(`scope/scopes-with-count`)
        .then((res) => res),
  });
}