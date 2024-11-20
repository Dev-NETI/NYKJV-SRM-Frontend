"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/hooks/auth";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthSessionStatus from "@/app/(auth)/AuthSessionStatus";

const FormSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email format.",
    }),
  })
  .strict();

const Page = () => {
  const { forgotPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = (data) => {
    // console.log(data);
    forgotPassword({ email: data.email, setErrors, setStatus });
  };

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email email
        address and we will email you a password reset link that that will allow
        you to choose a new one.
      </div>

      {/* Session Status */}
      <AuthSessionStatus className="mb-4" status={status} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="grid w-full max-w-sm items-center gap-1.5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-1" type="submit">
            Send Email Verification
          </Button>
        </form>
      </Form>
      <p className="mt-2 text-center text-sm text-gray-500">
        <a
          href="register"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Back to login
        </a>
      </p>
    </>
  );
};

export default Page;
