import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLogin() {
  return useMutation({
    mutationFn: ({email, password}) => {
      return axios.post(`http://localhost:8000/auth/login`, {
        email,
        password,
      });
    }
  });
}

export function useUserInformation() {
    return useQuery({
      queryKey: ["environments"],
      queryFn: () =>
        // axios.get(process.env.REACT_APP_BACKEND_HOST + `/environments`).then(({ data }) => data),
        axios.get(`http://localhost:8000/user`).then(({ data }) => data),
    });
  }