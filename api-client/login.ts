import { API } from "@/utils/constants";
import { Axios } from "@/lib/fetcher";
import { setCookie } from "cookies-next";

export function login(identifier: string, password: string) {
  return Axios.post(API.auth.login, {
    identifier,
    password,
  })
    .then((response) => {
      const res: { token: string } = response.data;

      setCookie("jwt_token", res.token, { maxAge: 7 * 24 * 60 * 60 });

      return res;
    })
    .catch((error) => {
      throw error;
    });
}
