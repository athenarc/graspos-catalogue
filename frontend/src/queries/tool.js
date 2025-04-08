import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `tool/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tools"]);
    },
  });
}

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    retry: false,
    queryFn: () => axiosInstance.get(`tool/all`),
  });
}

export function useTool(toolId) {
  return useQuery({
    queryKey: ["tool-" + String(toolId)],
    retry: false,
    queryFn: () => axiosInstance.get(`tool/${toolId}`),
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `tool/${document.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tools"]);
    },
  });
}

export function useUpdateTool(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `tool/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tools"]);
    },
  });
}
