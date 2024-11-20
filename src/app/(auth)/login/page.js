"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthSessionStatus from "@/app/(auth)/AuthSessionStatus";
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
import Image from "next/image";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

const Login = () => {
  const router = useRouter();
  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/login-otp",
  });

  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (router.reset?.length > 0 && errors.length === 0) {
      setStatus(atob(router.reset));
    } else {
      setStatus(null);
    }
  });

  const submitForm = async (data) => {
    login({
      email: data.email,
      password: data.password,
      remember: data.shouldRemember,
      setErrors,
      setStatus,
    });

    // await axios.post("/login-otp", data);
  };

  const googleLogin = async () => {
    try {
      router.replace("http://localhost:8000/auth/redirect");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
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
            Sign in to your account
          </h2>
        </div>
        <button
          onClick={googleLogin}
          type="button"
          className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" />
          </svg>
          Sign in with Google
        </button>
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
            <a
              href="forgot-password"
              className="text-sm text-indigo-600 text-right"
            >
              Forget password
            </a>

            <Button className="mt-1" type="submit">
              Login
            </Button>
          </form>
        </Form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Not register?{" "}
          <a
            href="register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Click here to register
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
