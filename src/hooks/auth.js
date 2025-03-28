import useSWR from "swr";
import axios from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();
  const [isVerifying, setIsVerifying] = useState(false);

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
          title: "Registration Successful",
          description: "You have successfully registered.",
        });

        const registrationCode = sessionStorage.getItem("registrationCode");
        // Mark code as used
        axios.post("/api/register-code/use", {
          code: registrationCode,
          email: props.email,
        });
        sessionStorage.removeItem("registrationCode");
        router.push("/login");
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
    setIsVerifying(true);

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
    } finally {
      setIsVerifying(false);
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

  const logout = useCallback(async () => {
    if (!error) {
      Cookies.remove("isVerified");
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  }, [error, mutate]);

  const checkVerified = async ({ user, pathname, router }) => {
    setIsVerifying(true);
    try {
      const response = await axios.get("/api/checking-status-otp");
      const currentPath = pathname;
      const roles = user?.roles || [];

      // First check: OTP verification
      if (response.data.status !== true) {
        if (currentPath !== "/login-otp") {
          router.push("/login-otp");
          return;
        }
      }

      // Second check: Role verification
      if (!roles.length) {
        router.push("/unauthorized");
        return;
      }

      // Check if user has permission for current path
      const hasRoleForPath = roles.some((role) => {
        const rolePath = `/${role.url}`;
        return (
          currentPath === rolePath || currentPath.startsWith(`${rolePath}/`)
        );
      });

      if (!hasRoleForPath && currentPath !== "/unauthorized") {
        router.push("/unauthorized");
        return;
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify access permissions",
      });
      // On error, redirect to login
      router.push("/login");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);

    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);

    if (middleware === "auth" && error) logout();
  }, [user, error, logout, middleware, redirectIfAuthenticated, router]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    checkVerified,
    logout,
    isVerifying,
  };
};
