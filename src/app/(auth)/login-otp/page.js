"use client";

import { React, useCallback, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/auth";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/(app)/Loading";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function LoginOtp() {
  const router = useRouter();
  const { user, logout } = useAuth({
    middleware: "auth",
  });
  const [tempt_otp, setTempt_otp] = useState(
    Math.floor(100000 + Math.random() * 900000)
  );

  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data) => {
    setIsVerifying(true);
    axios
      .post("/api/verify-otp", { otp: data.pin, temp_otp: tempt_otp })
      .then((response) => {
        toast({
          title: "Successfully Verified",
          description:
            "You have successfully verified your account. You can now log in.",
        });
        console.log(response.data.status);
        router.push("/product");
      })
      .catch((error) => {
        console.error("Error authenticating:", error.response.data.status);
        toast({
          title: "Authentication failed",
          variant: "destructive",
          description: error.response.data.status,
        });
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };

  const generateOtp = useCallback(async () => {
    setIsVerifying(true);
    try {
      const response = await axios.post("/api/authenticating", {
        tempt_otp: tempt_otp,
      });
      console.log(response.data.status);
    } catch (error) {
      console.error("Error authenticating:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [tempt_otp]);

  useEffect(() => {
    axios.get("/api/checking-status-otp").then((response) => {
      if (response.data.status === true) {
        router.push("/dashboard");
      } else {
        generateOtp();
      }
    });
  }, [generateOtp, router]);

  if (isVerifying) {
    return <Loading />;
  }

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
            Authentication
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl className="flex">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex mx-auto">
                        <InputOTPSlot type="number" index={0} />
                        <InputOTPSlot type="number" index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot type="number" index={2} />
                        <InputOTPSlot type="number" index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot type="number" index={4} />
                        <InputOTPSlot type="number" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Logout an Account?{" "}
          <button
            onClick={logout}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Click here
          </button>
        </p>
      </div>
    </>
  );
}

export default LoginOtp;
