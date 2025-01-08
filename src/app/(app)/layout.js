"use client";

import { useAuth } from "@/hooks/auth";
import Loading from "@/app/(app)/Loading";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/joy";

const AppLayout = ({ children }) => {
  const { user, checkVerified, isVerifying } = useAuth({
    middleware: "auth",
  });
  const pathname = usePathname();
  const router = useRouter(); // Use `useRouter` for navigation
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      checkVerified({ user, pathname, router });
    }
  }, [pathname, user, checkVerified, router]); // Ensure dependencies are correct

  if (isVerifying) {
    return <Loading />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        toggleSidebar={toggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          gap: 1,
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <Box
          sx={{
            p: 2,
            mb: "60px",
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default AppLayout;
