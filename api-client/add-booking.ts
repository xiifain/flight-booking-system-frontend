import { API } from "@/utils/constants";
import { Axios } from "@/lib/fetcher";

export type Booking = {
  departingFlights: number[];
  returningFlights: number[];
  paymentMethodId: number;
};

export function createBooking(data: Booking) {
  return Axios.post(API.bookings.create, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
}
