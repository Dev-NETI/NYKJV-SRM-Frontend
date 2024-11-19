"use client";
import {
  AssignmentRounded as AssignmentRoundedIcon,
  BrightnessAutoRounded as BrightnessAutoRoundedIcon,
  DashboardRounded as DashboardRoundedIcon,
  HomeRounded as HomeRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
  QuestionAnswerRounded as QuestionAnswerRoundedIcon,
  SearchRounded as SearchRoundedIcon,
  ShoppingCartRounded as ShoppingCartRoundedIcon,
} from "@mui/icons-material";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useAuth } from "@/hooks/auth";

const routes = [
  {
    group: "Main",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <DashboardRoundedIcon />,
      },
      { href: "/category", label: "Category", icon: <AssignmentRoundedIcon /> },
      { href: "/brand", label: "Brand", icon: <ShoppingCartRoundedIcon /> },
      { href: "/product", label: "Product", icon: <HomeRoundedIcon /> },
    ],
  },
  {
    group: "Communication",
    items: [
      { href: "/chat", label: "Chat", icon: <QuestionAnswerRoundedIcon /> },
    ],
  },
];

export default function Sidebar({ user }) {
  const { logout } = useAuth({
    middleware: "auth",
  });
  const pathname = usePathname();

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 100,
        height: "100dvh",
        width: "var(--Sidebar-width)", // Sidebar adjusts based on screen
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.surface",
        boxShadow: "xl",
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg" sx={{ fontWeight: "bold" }}>
          SRM App
        </Typography>
      </Box>

      {/* Search Input */}
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
        sx={{
          borderRadius: "8px",
          boxShadow: "sm",
          mt: 2,
        }}
      />

      {/* Navigation Links */}
      <Box
        sx={{
          mt: 2,
          flex: 1,
          overflow: "hidden auto",
        }}
      >
        {routes.map((group) => (
          <List
            key={group.group}
            size="sm"
            sx={{
              gap: 1,
              "--List-nestedInsetStart": "30px",
              "--ListItem-radius": "8px",
              mb: 2,
            }}
          >
            <ListItem nested>
              <Typography
                level="body-xs"
                sx={{
                  fontWeight: 600,
                  color: "neutral.500",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 1,
                  pl: 2,
                }}
              >
                {group.group}
              </Typography>
              <List>
                {group.items.map((route) => (
                  <ListItem key={route.href}>
                    <ListItemButton
                      component={Link}
                      href={route.href}
                      selected={pathname === route.href}
                      sx={{
                        pl: 2,
                        gap: 1.5,
                        "&.Mui-selected": {
                          backgroundColor: "primary.softBg",
                          "&:hover": {
                            backgroundColor: "primary.softHover",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "neutral.softHover",
                        },
                      }}
                    >
                      {route.icon}
                      <ListItemContent>
                        <Typography level="title-sm">{route.label}</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          </List>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Profile Section at the Bottom */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          borderRadius: "sm",
          bgcolor: "background.surface",
          boxShadow: "sm",
        }}
      >
        <Avatar
          src={user?.profile_photo_url}
          alt={user?.f_name}
          size="lg"
          sx={{
            "--Avatar-size": "40px",
            border: "2px solid",
            borderColor: "primary.500",
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography level="body-sm" fontWeight="bold">
            {user?.f_name}
          </Typography>
          <Typography level="body-xs" color="neutral.500">
            {user?.email}
          </Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={logout}
          sx={{
            "&:hover": {
              backgroundColor: "neutral.100",
            },
          }}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
