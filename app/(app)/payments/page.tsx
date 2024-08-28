"use client";

import PaymentsList from "@/components/payments-list";

export default function PaymentMethods() {
  return (
    <>
      <PaymentsList addHidden={false} onPaymentSelected={() => {}} />
    </>
  );
}
