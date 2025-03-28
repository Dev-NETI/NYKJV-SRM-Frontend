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
import Loading from "@/app/(app)/Loading";

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
  const { login, isVerifying } = useAuth({
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
  }, [router.reset, errors.length]);

  const submitForm = async (data) => {
    login({
      email: data.email,
      password: data.password,
      remember: data.shouldRemember,
      setErrors,
      setStatus,
    });
  };

  if (isVerifying) {
    return <Loading />;
  }

  const googleLogin = async () => {
    try {
      router.replace("http://localhost:8000/auth/redirect");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 ">
      <AuthSessionStatus className="mb-4" status={status} />

      <div className="w-full max-w-[500px] space-y-8 bg-white p-10 rounded-2xl shadow-lg mx-4">
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-4 text-center text-base text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <div className="mt-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-base font-medium">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-lg"
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
                    <FormLabel className="text-gray-700 text-base font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="px-4 py-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <a
                  href="forgot-password"
                  className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>

              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </form>
          </Form>
        </div>

        {/* <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div> */}

        <p className="mt-8 text-center text-base text-gray-600">
          Dont have an account?{" "}
          <a
            href="register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
