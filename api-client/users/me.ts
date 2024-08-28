import { API } from "@/utils/constants";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export type User = {
  id: number;
  userName?: string;
  profile: {
    id: number;
    email: string;
    firstName: string;
    lastName?: string;
    image?: string;
  };
};

export function useAuthorizedUser() {
  const { data, error, isLoading } = useSWR<User>(API.auth.me, fetcher);

  return {
    data,
    error,
    isLoading,
  };
}
