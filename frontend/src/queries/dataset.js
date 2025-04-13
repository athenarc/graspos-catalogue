import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `dataset/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}

export function useDatasets(filters = {}) {
  return useQuery({
    queryKey: ["datasets", filters],
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();

      // Loop through each filter and append key-value pairs to params
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object (like "licenses"), loop through its properties
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

      // Make the API call with the search parameters
      const response = await axiosInstance.get("dataset", { params });

      return response.data;
    },
    enabled: true,
  });
}

export function useDatasetLicenses(enabled) {
  return useQuery({
    queryKey: ["dataset-licenses"],
    retry: false,
    enabled: enabled,
    queryFn: () => axiosInstance.get(`dataset/licenses`),
  });
}

export function useDataset(datasetId) {
  return useQuery({
    queryKey: ["dataset-" + String(datasetId)],
    retry: false,
    queryFn: () => axiosInstance.get(`dataset/${datasetId}`),
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `dataset/${document.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}

export function useUpdateDataset(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `dataset/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets"]);
    },
  });
}
