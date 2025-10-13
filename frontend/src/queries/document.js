import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `document/create`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["countries-coverage-with-count"]);
    },
  });
}

export function useDocuments(filters = {}) {
  // Deep comparison of the filters object
  const queryKey = ["documents", JSON.stringify(filters)];

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
            if (
              key == "tags" ||
              key == "assessment_values" ||
              key == "evidence_types" ||
              key == "covered_fields" ||
              key == "covered_research_products"
            ) {
              value.forEach((arrayValue) => {
                params.append(
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

      const response = await axiosInstance.get("document", { params });

      return response.data;
    },
    enabled: true,
  });
}

export function useDocumentUniqueFieldValues(field, enabled, scope = "zenodo") {
  return useQuery({
    queryKey: ["document-unique-field-values", field, scope],
    enabled: enabled && !!field,
    retry: false,
    queryFn: () =>
      axiosInstance
        .get(`/document/fields/unique`, { params: { field, scope } })
        .then((res) => res),
  });
}

export function useDocument(documentId) {
  return useQuery({
    queryKey: ["document-" + String(documentId)],
    retry: false,
    queryFn: () => axiosInstance.get(`document/${documentId}`),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (document) => {
      return axiosInstance.delete(
        process.env.REACT_APP_BACKEND_HOST + `document/${document.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["countries-coverage-with-count"]);
    },
  });
}

export function useUpdateDocument(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.patch(
        process.env.REACT_APP_BACKEND_HOST + `document/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["countries-coverage-with-count"]);
    },
  });
}
