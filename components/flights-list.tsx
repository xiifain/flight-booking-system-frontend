import {
  FlightQuery,
  FlightQueryResponse,
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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

dayjs.extend(customParseFormat);

export type BookingInfo = {
  departingFlights: number[];
  returningFlights: number[];
  totalPrice: number;
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
  });

  const [query, setQuery] = useState<OverallFlightQuery>({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    class: "Economy",
  });

  const [debouncedQuery] = useDebouncedValue<FlightQuery>(
    {
      origin: query.origin,
      destination: query.destination,
      travelClass: query.class,
      departureDate: query.departureDate,
      returnDate: query.returnDate,
    },
    200
  );

  const { data } = useFlightsSearch(debouncedQuery);

  // State to track expanded flight items
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

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
        (isDeparting ? data.outboundFlights : data.returnFlights).map(
          (flight: FlightQueryResponse) => (
            <div key={flight.id} className="mx-2 my-5 md:mx-5">
              <div
                onClick={() => {
                  setExpandedFlightId(
                    expandedFlightId === flight.id ? null : flight.id
                  );
                }}
                className="group flex justify-between items-center hover:outline hover:outline-1 hover:bg-primary-foreground rounded-lg p-2 md:p-5 cursor-pointer"
              >
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={flight.logo} />
                  </Avatar>
                  <div className="mx-2">
                    <div>
                      <h2 className="text-md font-bold md:font-medium md:text-3xl md:pr-5 pr-5">
                        {dayjs(flight.flights[0].departureTime).format(
                          "h:mm A"
                        ) +
                          " - " +
                          dayjs(
                            flight.flights[flight.flights.length - 1]
                              .arrivalTime
                          ).format("h:mm A")}
                      </h2>
                    </div>
                    <div>{flight.flights[0].code}</div>
                  </div>
                </div>
                <h2 className="text-xl font-bold">
                  {flight.stops > 0 ? `${flight.stops} Stop` : "Non-Stop"}
                </h2>
                <div>
                  <h2 className="font-light text-md">
                    {flight.flights[0].originAirportCode +
                      " - " +
                      flight.flights[flight.flights.length - 1]
                        .destinationAirportCode}
                  </h2>
                </div>
                <h2 className="font-medium text-xl">
                  {flight.totalPrice + " THB"}
                </h2>
                <div className="ml-2">
                  {expandedFlightId === flight.id ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
              {/* Collapsible Details Section */}
              {expandedFlightId === flight.id && (
                <div className="p-4 rounded-b-lg">
                  {/* Display detailed information about the flight */}
                  {flight.flights.map((segment, index) => (
                    <div
                      key={segment.id}
                      className="flex justify-between items-center mb-4"
                    >
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarImage src={segment.logo} />
                        </Avatar>
                        <div className="ml-2">
                          <h3 className="font-semibold">
                            {segment.code} - {segment.fareClass}
                          </h3>
                          <p>
                            {segment.originAirportCode} (
                            {dayjs(segment.departureTime).format(
                              "MMM D, h:mm A"
                            )}
                            ) - {segment.destinationAirportCode} (
                            {dayjs(segment.arrivalTime).format("MMM D, h:mm A")}
                            )
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-right">
                          {`${Math.floor(segment.duration / 60)}h ${
                            segment.duration % 60
                          }m`}
                        </p>
                        <p className="text-right">{segment.price} THB</p>
                      </div>
                    </div>
                  ))}
                  {/* Select Flight Button */}
                  <Button
                    onClick={() => {
                      console.log(flight.flights.map((f) => f.id));
                      if (isDeparting) {
                        setBookingInfo({
                          ...bookingInfo,
                          departingFlights: flight.flights.map((f) => f.id),
                          totalPrice:
                            bookingInfo.totalPrice + flight.totalPrice,
                        });
                      } else {
                        setBookingInfo({
                          ...bookingInfo,
                          returningFlights: flight.flights.map((f) => f.id),
                          totalPrice:
                            bookingInfo.totalPrice + flight.totalPrice,
                        });
                      }
                      setIsDeparting(false);
                      // Collapse the expanded item
                      setExpandedFlightId(null);

                      console.log(bookingInfo);
                    }}
                    className="w-full mt-4"
                  >
                    {isDeparting
                      ? "Select Departing Flight"
                      : "Select Returning Flight"}
                  </Button>
                </div>
              )}
            </div>
          )
        )
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
              Total Price: {bookingInfo.totalPrice.toFixed(2)} THB
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
