import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `service/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["countries-coverage-with-count"]);
    },
  });
}

export function useServices(filters = {}) {
  // Deep comparison of the filters object
  const queryKey = ["services", JSON.stringify(filters)];

  return useQuery({
    queryKey: queryKey, // Ensure filters are deeply compared using serialization
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams();

      // Loop through each filter and append key-value pairs to params
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object (like "licenses"), loop through its properties
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (
              key == "tags" ||
              key == "trl" ||
              key == "assessment_functionalities" ||
              key == "assessment_values" ||
              key == "evidence_types" ||
              key == "covered_fields" ||
              key == "covered_research_products"
            ) {
              value.forEach((arrayValue) => {
                params.append(
                  key != "assessment_functionalities" &&
                    key != "covered_fields" &&
                    key != "covered_research_products" &&
                    key != "evidence_types" &&
                    key != "assessment_values"
                    ? key.replace(key, key.replace(/s+$/, ""))
                    : key,
                  arrayValue
                );
              });
            }
            if (subValue === true) {
              params.append(key.replace(key, key.replace(/s+$/, "")), subKey); // Append the subKey as a value if it's true
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

      // Make the API call with the search parameters
      const response = await axiosInstance.get("service", { params });

      return response.data;
    },
    enabled: true, // Ensure this fires by default if filters change
  });
}
export function useServiceUniqueFieldValues(
  field,
  enabled,
  scope = "openaire"
) {
  return useQuery({
    queryKey: ["service-unique-field-values", field, scope],
    enabled: enabled && !!field,
    retry: false,
    queryFn: () =>
      axiosInstance
        .get(`/service/fields/unique`, { params: { field, scope } })
        .then((res) => res),
  });
}

export function useService(serviceId) {
  return useQuery({
    queryKey: ["service-" + String(serviceId)],
    retry: false,
    queryFn: () => axiosInstance.get(`service/${serviceId}`),
  });
}

export function useServiceByUniqueSlug(uniqueSlug) {
  return useQuery({
    queryKey: ["service-" + String(uniqueSlug)],
    retry: false,
    queryFn: () => axiosInstance.get(`service/slug/${uniqueSlug}`),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `service/${document.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["countries-coverage-with-count"]);
    },
  });
}

export function useUpdateService(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `service/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["countries-coverage-with-count"]);
    },
  });
}
