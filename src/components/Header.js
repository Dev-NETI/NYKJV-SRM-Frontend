"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  Breadcrumbs,
  IconButton,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/joy";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle,
  Settings,
  Logout,
} from "@mui/icons-material";

import { toggleSidebar } from "../utils";

export default function Header() {
  const pathname = usePathname();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Remove (app) from pathname and split into segments
  const paths = pathname
    .replace(/^\/(app\/)?/, "")
    .split("/")
    .filter(Boolean);
  const MAX_LENGTH = 20;
  const formatPathName = (path) => {
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const truncatePath = (path) => {
    if (path.length > MAX_LENGTH) {
      return `${path.slice(0, MAX_LENGTH)}...`;
    }
    return path;
  };

  return (
    <Box
      component="header"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: "1px solid",
        borderColor: theme.palette.divider,
        position: "sticky",
        top: 0,
        backgroundColor: "background.surface",
        zIndex: 1100,
      }}
    >
      <IconButton
        onClick={toggleSidebar}
        variant="plain"
        size="sm"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <Breadcrumbs
          size="sm"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{
            "--Breadcrumbs-gap": "1rem",
            "--Icon-fontSize": "16px",
            fontWeight: "sm",
            px: 0,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <HomeIcon sx={{ fontSize: "inherit", color: "neutral.500" }} />
          </Link>

          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;
            const formattedName = formatPathName(path);
            const truncatedName = truncatePath(formattedName); // Apply truncation

            return isLast ? (
              <Typography
                key={path}
                sx={{
                  color: "primary.500",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
                title={formattedName} // Show full name on hover
              >
                {truncatedName}
              </Typography>
            ) : (
              <Link
                key={path}
                href={href}
                style={{
                  textDecoration: "none",
                  color: theme.palette.neutral[600],
                  fontSize: "0.875rem",
                }}
                title={formattedName} // Show full name on hover
              >
                {truncatedName}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </Box>
  );
}
