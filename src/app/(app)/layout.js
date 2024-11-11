"use client";

import { useAuth } from "@/hooks/auth";
import Navigation from "@/app/(app)/Navigation";
import Loading from "@/app/(app)/Loading";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AppLayout = ({ children, header }) => {
  const { user, checkVerified } = useAuth({
    middleware: "auth",
  });

  const path = usePathname();

  useEffect(() => {
    checkVerified({ user, path });
  }, [path, user]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />

      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
