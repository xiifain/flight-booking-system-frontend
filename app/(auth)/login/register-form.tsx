"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/api-client/register";
import { useState } from "react";
import { login } from "@/api-client/login";

const RegisterFormSchema = z.object({
  userName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(50),
  email: z.string().email({ message: "Invalid email" }),
  firstName: z.string(),
  lastName: z.string().optional(),
  password: z
    .string()
    .min(2, {
      message: "Password must be at least 2 characters",
    })
    .max(50),
});

export type RegisterFormDto = z.infer<typeof RegisterFormSchema>;

export function RegisterForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string | null;
    isError: boolean;
  } | null>(null);

  const formDefaultValues = {
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: formDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    setIsLoading(true);
    try {
      await register(values);
      await login(values.userName, values.password);
      router.push("/");
    } catch (e: any) {
      form.reset(formDefaultValues);
      setError({ isError: true, message: e.response.data.message });
    }
    setIsLoading(false);
  }

  return (
    <>
      <p className="mb-14 text-center text-5xl font-bold">Register</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            loading={isLoading}
            disabled={isLoading}
            type="submit"
            className="flex w-full mt-0"
          >
            Register
          </Button>
        </form>
      </Form>
    </>
  );
}
