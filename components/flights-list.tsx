import {
  FlightQuery,
  FlightResponse,
  OverallFlightQuery,
  useFlightsSearch,
} from "@/api-client/flights";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { DatePicker } from "./date-picker";
import PaymentsList from "./payments-list";
import { Button } from "./ui/button";
import { createBooking } from "@/api-client/add-booking";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export type BookingInfo = {
  departingFlights: number[];
  returningFlights: number[];
  totalPrice: number;
  totalCO2Emission: string;
};

export default function FlightsList() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onCreateBooking = () => {
    const bookingData = {
      departingFlights: bookingInfo.departingFlights,
      returningFlights: bookingInfo.returningFlights,
      paymentMethodId: selectedPaymentId!,
    };
    setIsLoading(true);

    createBooking(bookingData)
      .then(() => {
        console.log("Booking created");
        router.push("/bookings");
      })
      .catch((error) => {
        console.log("Error creating booking", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [isDeparting, setIsDeparting] = useState(true);

  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null
  );

  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    departingFlights: [],
    returningFlights: [],
    totalPrice: 0,
    totalCO2Emission: "",
  });

  const [query, setQuery] = useState<OverallFlightQuery>({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    class: "Economy",
  });

  const [debouncedDepartingQuery] = useDebouncedValue<FlightQuery>(
    {
      origin: query.origin,
      destination: query.destination,
      class: query.class,
      departureDate: query.departureDate,
    },
    200
  );

  const [debouncedReturningQuery] = useDebouncedValue<FlightQuery>(
    {
      origin: query.destination,
      destination: query.origin,
      class: query.class,
      departureDate: query.returnDate,
    },
    200
  );

  const { data } = useFlightsSearch(
    isDeparting ? debouncedDepartingQuery : debouncedReturningQuery
  );

  return (
    <>
      <div className="flex justify-between md:m-5 md:p-5 m-2 p-2">
        <Input
          type="text"
          className="mr-2"
          placeholder="Origin Airport"
          value={query.origin}
          onChange={(e) => setQuery({ ...query, origin: e.target.value })}
        />
        <Input
          type="text"
          className="mr-2"
          placeholder="Destination Airport"
          value={query.destination}
          onChange={(e) => setQuery({ ...query, destination: e.target.value })}
        />
        <DatePicker
          className="w-full mr-2"
          handleSelected={(date) => {
            if (date) {
              setQuery({
                ...query,
                departureDate: date.toISOString().split("T")[0],
              });
            }
          }}
        >
          Departure Date
        </DatePicker>
        <DatePicker
          className="w-full mr-2"
          handleSelected={(date) => {
            if (date) {
              setQuery({
                ...query,
                returnDate: date.toISOString().split("T")[0],
              });
            }
          }}
        >
          Return Date
        </DatePicker>
      </div>
      {data ? (
        data.items.map((flight: FlightResponse) => (
          <div
            onClick={() => {
              if (isDeparting) {
                setBookingInfo({
                  ...bookingInfo,
                  departingFlights: [...flight.flights.map((f) => f.id)],
                  totalPrice: bookingInfo.totalPrice + flight.totalPrice,
                  totalCO2Emission: flight.totalCO2Emission,
                });
              } else {
                setBookingInfo({
                  ...bookingInfo,
                  returningFlights: [...flight.flights.map((f) => f.id)],
                  totalPrice: bookingInfo.totalPrice + flight.totalPrice,
                  totalCO2Emission: flight.totalCO2Emission,
                });
              }

              setIsDeparting(false);
            }}
            key={flight.id}
            className="group flex justify-between items-center hover:outline hover:outline-1 hover:bg-primary-foreground rounded-lg mx-2 my-5 p-2 md:mx-5 md:p-5 "
          >
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={flight.logo} />
              </Avatar>
              <div className="mx-2">
                <div>
                  <div className="flex">
                    <h2 className="text-md font-bold md:font-medium md:text-3xl md:pr-5 pr-5">
                      {flight.flights[0].departureAirport.iataCode +
                        " - " +
                        flight.flights[0].destinationAirport.iataCode}
                    </h2>
                    <h2 className="text-md font-bold md:font-medium md:text-xs md:pr-5 pr-5">
                      {flight.flights[0].airplane.code}
                    </h2>
                  </div>
                  <h2 className="text-md font-bold md:font-medium md:text-xl md:pr-5 pr-5">
                    {flight.flights[0].departureTime +
                      " - " +
                      flight.flights[0].arrivalTime}
                  </h2>
                </div>
              </div>
            </div>
            <h2 className="font-medium text-xl">
              {flight.totalPrice + " THB"}
            </h2>
          </div>
        ))
      ) : (
        <div className="flex justify-center">
          <h2>Empty Flights Data</h2>
        </div>
      )}
      {bookingInfo.departingFlights.length > 0 &&
      bookingInfo.returningFlights.length > 0 ? (
        <div className="m-5">
          <div className="flex justify-between md:m-5 md:p-5 m-2 p-2">
            <h2 className="text-xl font-bold md:font-medium md:text-3xl">
              Total Price: {bookingInfo.totalPrice} THB
            </h2>
            <h2 className="text-xl font-bold md:font-medium md:text-3xl">
              Total CO2 Emission: {bookingInfo.totalCO2Emission}
            </h2>
          </div>
          <PaymentsList
            addHidden={true}
            onPaymentSelected={(id) => {
              setSelectedPaymentId(id);
            }}
          />
          <Button
            onClick={onCreateBooking}
            loading={isLoading}
            disabled={selectedPaymentId === null}
            className="w-full"
          >
            Book These Flights
          </Button>
        </div>
      ) : null}
    </>
  );
}
