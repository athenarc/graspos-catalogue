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
