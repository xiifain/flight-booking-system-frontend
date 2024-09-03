import { API } from "@/utils/constants";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import queryString from "query-string";

export type Paginated<T> = {
  meta: {};
  items: Array<T>;
};

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
  class: string;
};

export type Flight = {
  id: number;
  legroom?: string;
  emission?: string;
  airline: {
    id: number;
    name: string;
    code: string;
    country: {
      id: number;
      name: string;
      isoCode: string;
    };
  };
  airplane: {
    id: number;
    code: string;
    type: string;
    classes: string[];
  };
  departureAirport: {
    id: number;
    name: string;
    iataCode: string;
    city: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
        isoCode: string;
      };
    };
  };
  destinationAirport: {
    id: number;
    name: string;
    iataCode: string;
    city: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
        isoCode: string;
      };
    };
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
};

export type LayOver = {
  duration: number;
  airport: {
    id: number;
    name: string;
    iataCode: string;
    city: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
        isoCode: string;
      };
    };
  };
};

export type FlightResponse = {
  id: number;
  logo?: string;
  flights: Flight[];
  layovers: LayOver[];
  totalPrice: number;
  totalCO2Emission: string;
  type: string;
};

export function useFlightsSearch(query: FlightQuery) {
  const { data, error, isLoading, mutate } = useSWR<Paginated<FlightResponse>>(
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
