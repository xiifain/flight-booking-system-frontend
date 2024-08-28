import axios from "axios";
import { getCookie } from "cookies-next";

let jwtToken = null;
if (global?.window !== undefined) {
  jwtToken = getCookie("jwt_token");
}

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 3000,
});

if (jwtToken) {
  Axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
}

export const fetcher = (url: string) => Axios.get(url).then((res) => res.data);
