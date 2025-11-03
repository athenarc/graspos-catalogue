import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    retry: false,
    queryFn: () => axiosInstance.get(`assessment`).then((res) => res),
  });
}

export function useAssessmentsWithCount() {
  return useQuery({
    queryKey: ["assessment-with-count"],
    retry: false,
    queryFn: () =>
      axiosInstance.get(`assessment/assessment-with-count`).then((res) => res),
  });
}
