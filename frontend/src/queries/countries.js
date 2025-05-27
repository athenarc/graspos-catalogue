import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCountries(field) {
  return useQuery({
    queryKey: ["countries", field],
    retry: false,
    queryFn: () => axiosInstance.get(`country`).then((res) => res),
  });
}

export function useCountriesWithCount(field) {
  return useQuery({
    queryKey: ["countries", field],
    retry: false,
    queryFn: () => axiosInstance.get(`country/geographical-coverage-with-count`).then((res) => res),
  });
}