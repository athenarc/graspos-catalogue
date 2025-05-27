import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    retry: false,
    queryFn: () => axiosInstance.get(`assessment`).then((res) => res),
  });
}
