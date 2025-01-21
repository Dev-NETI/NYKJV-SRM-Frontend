"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
const FormSchema = z
  .object({
    f_name: z.string().optional(),
    m_name: z.string().nullable(),
    l_name: z.string().optional(),
    contact_number: z.string().optional(),
    email: z.string().email({
      message: "Invalid email format.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    passwordConfirmation: z.string(),
  })
  .strict();

const Page = () => {
  const router = useRouter();
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      f_name: "",
      m_name: "",
      l_name: "",
      contact_number: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const [errors, setErrors] = useState([]);

  const submitForm = async (data) => {
    await register({
      f_name: data.f_name,
      m_name: data.m_name,
      l_name: data.l_name,
      contact_number: data.contact_number,
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
      setErrors,
    });

    router.push("/login");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center items-center">
            <Image
              src="/SRM.png"
              alt="NYKJV-SRM-Logo"
              width={250}
              height={250}
            />
          </div>
          <h2 className="mt-10 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register an account
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="grid w-full max-w-sm items-center gap-1.5"
          >
            <FormField
              control={form.control}
              name="f_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="m_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="l_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Contact Number"
                      {...field}
                    />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
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
                  <FormLabel>Confirmation Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-5" type="submit">
              Register
            </Button>
          </form>
        </Form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Click here to login
          </a>
        </p>
      </div>
    </>
  );
};

export default Page;
