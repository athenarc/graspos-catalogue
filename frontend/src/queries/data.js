import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLogin() {
  return useMutation({
    mutationFn: ({ username, password }) => {
      return axios.post(process.env.REACT_APP_BACKEND_HOST + `/auth/login`, {
        username,
        password,
      });
    },
  });
}

export function useUserInformation() {
  return useQuery({
    queryKey: ["environments"],
    queryFn: () =>
      axios
        .get(process.env.REACT_APP_BACKEND_HOST + `/user`)
        .then(({ data }) => data),
  });
}
