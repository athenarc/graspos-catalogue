import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLogin() {
  return useMutation({
    mutationFn: ({username, password}) => {
      return axios.post(`http://localhost:8000/auth/login`, {
        username,
        password,
      });
    }
  });
}

export function useUserInformation() {
    return useQuery({
      queryKey: ["environments"],
      queryFn: () =>
        axios.get(`http://localhost:8000/user`).then(({ data }) => data),
    });
  }