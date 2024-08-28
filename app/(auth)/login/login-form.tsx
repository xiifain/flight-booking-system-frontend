"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { login } from "@/api-client/login";
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
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setCookie } from "cookies-next";

const loginFormSchema = z.object({
  identifier: z
    .string()
    .min(2, {
      message: "Username or Email must be at least 2 characters",
    })
    .max(50),
  password: z
    .string()
    .min(2, {
      message: "Password must be at least 2 characters",
    })
    .max(50),
});

export function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string | null;
    isError: boolean;
  } | null>(null);

  const formDefaultValues: z.infer<typeof loginFormSchema> = {
    identifier: "",
    password: "",
  };

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: formDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setError({ message: null, isError: false });
    setIsLoading(true);
    try {
      await login(values.identifier, values.password);
      router.push("/");
    } catch (e: any) {
      form.reset(formDefaultValues);
      setError({ isError: true, message: e.response.data.message });
    }
    setIsLoading(false);
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL || "",
        {
          code,
        }
      );

      const res: { token: string } = response.data;

      setCookie("jwt_token", res.token, { maxAge: 7 * 24 * 60 * 60 });
      router.push("/");
    },
    flow: "auth-code",
  });

  return (
    <>
      <p className="mb-14 text-center text-3xl font-bold">
        Flight Booking System
      </p>
      <div className="mb-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            onChange={() => setError({ message: null, isError: false })}
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username or Email" {...field} />
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
            {!error?.isError ? null : (
              <FormMessage>{error?.message}</FormMessage>
            )}
            <Button
              loading={isLoading}
              disabled={isLoading}
              type="submit"
              className="flex w-full mt-0"
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
      <Button className="flex w-full mt-2" onClick={() => googleLogin()}>
        Signin With Google
      </Button>
    </>
  );
}
