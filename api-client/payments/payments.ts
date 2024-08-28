import { API } from "@/utils/constants";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import queryString from "query-string";

export type PaymentMethod = {
  id: number;
  cardholderName: string;
  cardNumber: string;
  expirationMonth: string;
};

export function usePaymentsSearch() {
  const { data, error, isLoading, mutate } = useSWR<PaymentMethod[]>(
    queryString.stringifyUrl({ url: API.payments.search }),
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
