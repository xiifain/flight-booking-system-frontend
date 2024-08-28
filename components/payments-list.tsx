"use client";

import { usePaymentsSearch } from "@/api-client/payments/payments";
import AddPayment from "./add-payment";

type Props = {
  onPaymentSelected: (id: number) => void;
  addHidden: boolean;
};

export default function PaymentsList({ onPaymentSelected, addHidden }: Props) {
  const { data, mutate } = usePaymentsSearch();

  return (
    <>
      {addHidden ? null : (
        <div className="mx-5">
          <AddPayment onSuccess={mutate} />
        </div>
      )}
      <ul>
        {data?.map((payment) => (
          <div
            onClick={() => onPaymentSelected(payment.id)}
            key={payment.id}
            className="group flex justify-between items-center hover:outline hover:outline-1 hover:bg-primary-foreground rounded-lg mx-2 my-5 p-2 md:mx-5 md:p-5 "
          >
            <div className="flex items-center">
              <div className="mx-2">
                <div className="flex">
                  <h2 className="text-md font-bold md:font-medium md:text-xl md:pr-5 pr-2">
                    {payment.cardholderName}
                  </h2>
                </div>
                <div className="flex items-start mt-2">
                  <p className="items-start font-light text-lg">
                    {payment.cardNumber}
                  </p>
                  <p className="ml-5 items-start font-light text-lg">
                    {payment.expirationMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
}
