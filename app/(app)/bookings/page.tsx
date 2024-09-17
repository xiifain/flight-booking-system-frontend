"use client";

import { Booking, useBookings } from "@/api-client/booking-list";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

dayjs.extend(customParseFormat);

export default function Bookings() {
  const { data, isLoading, error } = useBookings();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <h2>Loading Bookings...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <h2>Error loading bookings.</h2>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center">
        <h2>No Bookings Found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-5 mx-2 my-5 md:mx-5">
      {data.map((booking) => (
        <BookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function BookingItem({ booking }: { booking: Booking }) {
  const [isExpanded, setIsExpanded] = useState(false); // State for collapsing/expanding details
  const departureFlights = booking.departingFlights || [];
  const returnFlights = booking.returningFlights || [];

  // Construct departure sequence
  let departureSequence: string[] = [];
  if (departureFlights.length > 0) {
    departureSequence.push(
      departureFlights[0].flight.departureAirport.iataCode
    );
    departureFlights.forEach((fb) => {
      departureSequence.push(fb.flight.destinationAirport.iataCode);
    });
  }

  // Construct return sequence
  let returnSequence: string[] = [];
  if (returnFlights.length > 0) {
    returnSequence.push(returnFlights[0].flight.departureAirport.iataCode);
    returnFlights.forEach((fb) => {
      returnSequence.push(fb.flight.destinationAirport.iataCode);
    });
  }

  return (
    <div className="group flex flex-col justify-start items-start hover:outline hover:outline-1 hover:bg-primary-foreground rounded-lg p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Booking Code: {booking.code}
        </h2>
        <div className="mt-2 text-lg md:text-xl">
          {departureSequence.length > 0 && (
            <p>Departure: {departureSequence.join(" ➔ ")}</p>
          )}
          {returnSequence.length > 0 && (
            <p>Return: {returnSequence.join(" ➔ ")}</p>
          )}
        </div>
      </div>

      {/* Toggle button for collapsing/expanding details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-auto flex items-center text-primary font-medium text-lg"
      >
        {isExpanded ? "Hide Details" : "Show Details"}
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 ml-1" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1" />
        )}
      </button>

      {/* Collapsible details section */}
      {isExpanded && (
        <div className="mt-4 p-4 rounded-lg w-full">
          {/* Departure Flights Details */}
          {departureFlights.length > 0 && (
            <>
              <h3 className="text-xl font-semibold">Departing Flights</h3>
              {departureFlights.map((fb, index) => (
                <div key={index} className="mt-2 flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={fb.flight.airline.logo} />
                  </Avatar>
                  <div className="flex-1">
                    <p>{`${fb.flight.airline.name} - ${fb.flight.airplane.code}`}</p>
                    <p>
                      {fb.flight.departureAirport.iataCode} (
                      {dayjs(fb.departureTime).format("MMM D, h:mm A")}) ➔{" "}
                      {fb.flight.destinationAirport.iataCode} (
                      {dayjs(fb.arrivalTime).format("MMM D, h:mm A")})
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Return Flights Details */}
          {returnFlights.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-4">Returning Flights</h3>
              {returnFlights.map((fb, index) => (
                <div key={index} className="mt-2 flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={fb.flight.airline.logo} />
                  </Avatar>
                  <div className="flex-1">
                    <p>{`${fb.flight.airline.name} - ${fb.flight.airplane.code}`}</p>
                    <p>
                      {fb.flight.departureAirport.iataCode} (
                      {dayjs(fb.departureTime).format("MMM D, h:mm A")}) ➔{" "}
                      {fb.flight.destinationAirport.iataCode} (
                      {dayjs(fb.arrivalTime).format("MMM D, h:mm A")})
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
