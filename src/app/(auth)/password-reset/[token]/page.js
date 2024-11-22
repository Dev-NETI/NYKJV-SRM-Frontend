"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthSessionStatus from "@/app/(auth)/AuthSessionStatus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  passwordConfirmation: z.string(),
});

const PasswordReset = () => {
  const searchParams = useSearchParams();

  const { resetPassword } = useAuth({ middleware: "guest" });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = (data) => {
    resetPassword({
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
      setErrors,
      setStatus,
    });
  };

  useEffect(() => {
    form.setValue("email", searchParams.get("email") || "");
  }, [searchParams.get("email")]);

  return (
    <>
      {/* Session Status */}
      <AuthSessionStatus className="mb-4" status={status} />

      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center items-center">
            <Image
              src="/SRM.png"
              alt="NYKJV-SRM-Logo"
              width={250}
              height={250}
              priority
            />
          </div>
          <h2 className="mt-10 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset Password Link
          </h2>
        </div>
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
                    <Input
                      type="email"
                      placeholder="Email address"
                      disabled
                      {...field}
                    />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-3" type="submit">
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PasswordReset;
