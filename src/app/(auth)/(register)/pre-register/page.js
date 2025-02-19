"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function PreRegister() {
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/api/register-code/check", {
        code: values.code,
      });

      if (response.data.message === "Code is valid") {
        // Store the code in sessionStorage
        sessionStorage.setItem("registrationCode", values.code);

        // Redirect to register page
        router.push("/register");
      } else {
        setError("Invalid registration code");
      }
    } catch (error) {
      setError("Error verifying code");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[500px] space-y-8 bg-white p-10 rounded-2xl shadow-lg mx-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center items-center">
            <Image
              src="/SRM.png"
              alt="NYKJV-SRM-Logo"
              width={250}
              height={250}
            />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Enter Registration Code
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div>
                <FormField
                  control={form.control}
                  name="code"
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
                        Please enter the one-time password to proceed to the
                        registration form.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Verify Code
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default PreRegister;
