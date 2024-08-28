"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "./register-form";

export default function Login() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return (
    <main className="flex justify-center h-screen m-auto max-w-md flex-col">
      <div className="lg:border-b lg:border-gray-300 lg:bg-gradient-to-b lg:from-zinc-200 backdrop-blur-2xl lg:dark:border-neutral-800 dark:from-inherit lg:rounded-xl lg:border lg:bg-gray-200 lg:p-10 lg:dark:bg-zinc-800/30">
        {isLoginForm ? <LoginForm /> : <RegisterForm />}
      </div>
      <Button
        variant="ghost"
        name="register"
        type="button"
        className="mt-5"
        onClick={() => setIsLoginForm(!isLoginForm)}
      >
        {isLoginForm ? "Register A New Account" : "Login To The System"}
      </Button>
    </main>
  );
}
