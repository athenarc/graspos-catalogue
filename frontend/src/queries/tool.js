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
  // Deep comparison of the filters object
  const queryKey = ["tools", JSON.stringify(filters)];

  return useQuery({
    queryKey: queryKey,
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();

      // Loop through each filter and append key-value pairs to params
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object (like "license"), loop through its properties
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (key == "tags") {
              value.forEach((arrayValue) => {
                params.append(
                  key.replace(key, key.replace(/s+$/, "")),
                  arrayValue
                );
              });
            }
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

      // Handle start and end date filters
      if (filters.dateRange) {
        let { startDate, endDate } = filters.dateRange;

        // Ensure startDate and endDate are Date objects
        if (startDate && !(startDate instanceof Date)) {
          startDate = new Date(startDate); // Convert startDate to Date if it's not already
        }

        if (endDate && !(endDate instanceof Date)) {
          endDate = new Date(endDate); // Convert endDate to Date if it's not already
        }

        // Append the formatted dates to the URL parameters
        if (startDate && !isNaN(startDate)) {
          // Convert startDate to ISO string and append it to the query
          params.append("start", startDate.toISOString().split("T")[0]);
        }

        if (endDate && !isNaN(endDate)) {
          // Convert endDate to ISO string and append it to the query
          params.append("end", endDate.toISOString().split("T")[0]);
        }
      }

      const response = await axiosInstance.get("tool", { params });

      return response.data;
    },
    enabled: true,
  });
}

export function useToolUniqueFieldValues(field, enabled) {
  return useQuery({
    queryKey: ["tool-unique-field-values", field],
    enabled: enabled && !!field,
    retry: false,
    queryFn: () =>
      axiosInstance
        .get(`/tool/fields/unique`, { params: { field } })
        .then((res) => res),
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
