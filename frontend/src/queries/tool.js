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

export function useTools(filters = {}) {
  return useQuery({
    queryKey: ["tools", filters],
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Loop through each filter and append key-value pairs to params
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object (like "license"), loop through its properties
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue === true) {
              params.append(key.replace("licenses", "license"), subKey); // Append the subKey as a value if it's true
            }
          });
        } else if (typeof value === "boolean" || value) {
          // If value is boolean or truthy (like "graspos")
          params.append(key, value);
        }
      });

      // Handle sorting parameters (sort_field and sort_direction)
      if (filters.sortField) {
        params.append("sort_field", filters.sortField); // Add the sort field
      }
      if (filters.sortDirection) {
        params.append("sort_direction", filters.sortDirection); // Add the sort direction
      }

      const response = await axiosInstance.get("tool", { params });

      return response.data;
    },
    enabled: true,
  });
}

export function useToolLicenses(enabled) {
  return useQuery({
    queryKey: ["tool-licenses"],
    retry: false,
    enabled: enabled,
    queryFn: () => axiosInstance.get(`tool/licenses`),
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
