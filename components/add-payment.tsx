import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";
import { addPayment } from "@/api-client/payments/add-payment";

export const createPaymentSchema = z.object({
  cardholderName: z.string(),
  cardNumber: z.string().max(16),
  expirationMonth: z.string().max(2),
  expirationYear: z.string().max(2),
  cvv: z.string().max(3),
});

export default function AddPayment({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formDefaultValues: z.infer<typeof createPaymentSchema> = {
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  };

  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: formDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof createPaymentSchema>) {
    setIsLoading(true);
    try {
      await addPayment(values);
      onSuccess();
      setOpen(false);
    } catch (e: any) {
      console.error(e);
    }
    form.reset(formDefaultValues);
    setIsLoading(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage a new Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to your account
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="[&_:is(div)]:m-2">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Card Holder Name"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Card Number"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between [&_:is(div)]:m-2">
                <FormField
                  control={form.control}
                  name="expirationMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expirationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="CVV"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button loading={isLoading} className="m-2 mt-5" type="submit">
                  Add
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
