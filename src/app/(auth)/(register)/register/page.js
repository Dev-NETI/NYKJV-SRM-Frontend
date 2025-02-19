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
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import React from "react";
import axios from "@/lib/axios";

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

  useEffect(() => {
    const checkRegistrationCode = async () => {
      const registrationCode = sessionStorage.getItem("registrationCode");

      if (registrationCode) {
        try {
          const response = await axios.post("/api/register-code/check", {
            code: registrationCode,
          });

          if (response.data.message === "Code is invalid") {
            router.push("/pre-register");
          }
        } catch (error) {
          console.error("Error checking registration code:", error);
          router.push("/pre-register");
        }
      }

      if (!registrationCode) {
        router.push("/pre-register");
      }
    };

    checkRegistrationCode();
  }, [router]);

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

    console.log(errors);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/SRM.png"
            alt="NYKJV-SRM-Logo"
            width={180}
            height={180}
            className="mb-2"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please fill in your information below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="f_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        First name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="l_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Last name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Doe"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="m_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Middle name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="(Optional)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
              >
                Create Account
              </Button>
            </form>
          </Form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in instead
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
