import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "./interceptor";

// export function useZenodo(url) {
//   return useQuery({
//     queryKey: ["zenodo-" + url],
//     retry: false,
//     queryFn: () => axiosInstance.get(`zenodo/search`),
//   });
// }

export function useZenodo() {
  return useMutation({
    queryKey: ["zenodo"],
    retry: false,
    mutationFn: ({ data }) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `zenodo/search`,
        data
      );
    },
  });
}

export function useUpdateZenodo() {
  return useMutation({
    queryKey: ["zenodo-update"],
    retry: false,
    mutationFn: (data) => {
      return axiosInstance.post(
        process.env.REACT_APP_BACKEND_HOST + `zenodo/update`,
        data
      );
    },
  });
}
