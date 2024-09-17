import { API } from "@/utils/constants";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import queryString from "query-string";

export type OverallFlightQuery = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  class: string;
};

export type FlightQuery = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelClass: string;
};

export type FlightInstance = {
  id: number;
  code: string;
  logo: string;
  departureTime: string;
  arrivalTime: string;
  originAirportCode: string;
  destinationAirportCode: string;
  duration: number;
  fareClass: string;
  price: number;
};

export type FlightQueryResponse = {
  id: string;
  logo: string;
  totalDuration: string;
  totalPrice: number;
  stops: number;
  flights: FlightInstance[];
};

export type FlightResponse = {
  outboundFlights: FlightQueryResponse[];
  returnFlights: FlightQueryResponse[];
};

export function useFlightsSearch(query: FlightQuery) {
  const { data, error, isLoading, mutate } = useSWR<FlightResponse>(
    queryString.stringifyUrl(
      { url: API.flights.search, query },
      { skipEmptyString: true }
    ),
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
