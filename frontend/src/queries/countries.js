import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    retry: false,
    queryFn: () => axiosInstance.get(`country`).then((res) => res),
  });
}

export function useCountriesWithCount() {
  return useQuery({
    queryKey: ["countries-coverage-with-count"],
    retry: false,
    queryFn: () =>
      axiosInstance
        .get(`country/geographical-coverage-with-count`)
        .then((res) => res),
  });
}
