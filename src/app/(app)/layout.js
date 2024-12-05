"use client";

import { useAuth } from "@/hooks/auth";
import Loading from "@/app/(app)/Loading";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/joy";

const AppLayout = ({ children }) => {
  const { user, checkVerified } = useAuth({
    middleware: "auth",
  });
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkVerified({ user, pathname });
  }, [pathname, user]);

  if (!user) {
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
