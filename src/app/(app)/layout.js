"use client";

import { useAuth } from "@/hooks/auth";
import Loading from "@/app/(app)/Loading";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Box } from "@mui/joy";  
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
 
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'; 
const AppLayout = ({ children, header }) => {
  const { user, checkVerified } = useAuth({
    middleware: "auth",
  }); 
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  useEffect(() => {
    checkVerified({ user, pathname });
  }, [pathname, user]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar user={user} />
        <Box
          component="main"
          className="MainContent"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            p: 2,
          }}
        >
          <Header />
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <Link underline="none" color="neutral" href="/" aria-label="Home">
              <HomeRoundedIcon />
            </Link>
            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;
              const label = path.charAt(0).toUpperCase() + path.slice(1);

              return isLast ? (
                <Typography
                  key={path}
                  color="primary"
                  sx={{ fontWeight: 500, fontSize: 12 }}
                >
                  {label}
                </Typography>
              ) : (
                <Link
                  key={path}
                  underline="hover"
                  color="neutral"
                  href={href}
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {label}
                </Link>
              );
            })}
          </Breadcrumbs>
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default AppLayout;
