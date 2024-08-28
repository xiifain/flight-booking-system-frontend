import { API } from "@/utils/constants";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { Flight } from "./flights";

export type Booking = {
  id: number;
  code: string;
  departingFlights: Flight[];
  returningFlights: Flight[];
  paymentMethod: {
    id: number;
    cardholderName: string;
    cardNumber: string;
    expirationMonth: string;
  };
};

export function useBookings() {
  const { data, error, isLoading, mutate } = useSWR<Booking[]>(
    API.bookings.find,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
