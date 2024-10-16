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
    setErrors([]);
    setStatus(null);

    try {
      await csrf();

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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Authentication are not working. Please try again.",
      });
    }
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

  const checkVerified = async ({ user, path }) => {
    try {
      const response = await axios.get("api/checking-status-otp");
      const currentPath = path;

      console.log("Current Path:", currentPath);

      const roles = user?.roles; // Ensure user is defined

      // Check if user is verified
      if (response.data.status === true) {
        // Allow access only if the currentPath matches one of the roles or if user has any roles
        if (roles && roles.length > 0) {
          const hasRoleForPath = roles.some(
            (role) => currentPath === "/" + role.url // Check against the current path
          );

          if (!hasRoleForPath) {
            router.push("/unauthorized"); // Redirect to unauthorized if no role matches
          }
        }
      } else {
        // If user is not verified, restrict access to login-otp only
        if (currentPath !== "/login-otp") {
          router.push("/login-otp"); // Redirect to login-otp
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      // Handle the error accordingly, e.g., redirect or notify user
    }
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
