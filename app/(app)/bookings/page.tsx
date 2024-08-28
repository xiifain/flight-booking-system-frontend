"use client";

import { useBookings } from "@/api-client/booking-list";

export default function Bookings() {
  const { data } = useBookings();

  return (
    <>
      {data ? (
        data.map((booking) => (
          <div
            key={booking.id}
            className="group flex justify-between items-center hover:outline hover:outline-1 hover:bg-primary-foreground rounded-lg mx-2 my-5 p-2 md:mx-5 md:p-5 "
          >
            <div className="flex items-center">
              <div className="mx-2">
                <div>
                  <h2 className="text-md font-bold md:font-medium md:text-3xl md:pr-5 pr-5">
                    {booking.code}
                  </h2>
                  <h2 className="text-md font-bold md:font-medium md:text-lg md:pr-5 pr-5">
                    {booking.departingFlights[0].departureAirport.iataCode +
                      " - " +
                      booking.departingFlights[0].destinationAirport.iataCode}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center">
          <h2>Empty Bookings Data</h2>
        </div>
      )}
    </>
  );
}
