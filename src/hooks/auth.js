import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/register", props)
      .then(() => {
        setTimeout(() => {}, 3000);
        toast({
          variant: "secondary",
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
      })
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        const errorMessages = Object.values(error.response.data.errors).map(
          (errorMessage) => <li key={errorMessage}>{errorMessage}</li>
        );

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: <ul>{errorMessages}</ul>,
        });

        setErrors(error.response.data.errors);
      });
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    await axios
      .post("/login", props)
      .then(() => {
        toast({
          variant: "secondary",
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
      })
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        // console.log(error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).map(
          (errorMessage) => <li key={errorMessage}>{errorMessage}</li>
        );

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: <ul>{errorMessages}</ul>,
        });
        setErrors(error.response.data.errors);
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        const errorMessages = Object.values(error.response.data.errors).map(
          (errorMessage) => <li key={errorMessage}>{errorMessage}</li>
        );

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: <ul>{errorMessages}</ul>,
        });
        setErrors(error.response.data.errors);
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        const errorMessages = Object.values(error.response.data.errors).map(
          (errorMessage) => <li key={errorMessage}>{errorMessage}</li>
        );

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: <ul>{errorMessages}</ul>,
        });
        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      Cookies.remove("isVerified");
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  const [verified, setVerified] = useState(false);

  const verifiedOtpSuccess = () => {
    // Cookies.set("isVerified", "true", { secure: true, sameSite: "strict" });
    // if (verified === true) {
    //   router.push("/dashboard");
    // } else {
    console.log(verified);
    router.push("/login-otp"); // Add a leading slash to the route path
    //   console.log("Not verified");
    // }
  };

  const checkVerified = async () => {
    await axios.get("/checking-status-otp").then((response) => {
      if (response.data.status === true) {
        router.push("/dashboard");
        console.log("Verified");
      } else {
        router.push("/login-otp");
        console.log("Not Verified");
      }
    });
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);

    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);

    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    checkVerified,
    logout,
  };
};
