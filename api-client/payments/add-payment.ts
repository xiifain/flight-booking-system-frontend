import { API } from "@/utils/constants";
import { Axios } from "@/lib/fetcher";
import { z } from "zod";
import { createPaymentSchema } from "@/components/add-payment";

export function addPayment(data: z.infer<typeof createPaymentSchema>) {
  const obj = {
    ...data,
    expirationMonth: `${data.expirationMonth}/${data.expirationYear}`,
  };
  return Axios.post(API.payments.add, obj)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
}
