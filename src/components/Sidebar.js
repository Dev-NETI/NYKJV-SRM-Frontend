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
  PersonRounded as PersonIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ArticleIcon from "@mui/icons-material/Article";
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
import Image from "next/image";
import { Tooltip } from "@mui/material";

const routes = [
  {
    group: "Main",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <DashboardRoundedIcon />,
      },
      {
        href: "/product",
        label: "Products",
        icon: <ProductionQuantityLimitsIcon />,
      },
      { href: "/orders", label: "Orders", icon: <ShoppingCartIcon /> },
      {
        href: "/supplier-document/compliance",
        label: "Compliance Documents",
        icon: <ArticleIcon />,
      },
      {
        href: "/supplier-document",
        label: "Order Documents",
        icon: <ArticleIcon />,
      },
    ],
  },
  {
    group: "Communication",
    items: [
      { href: "/chat", label: "Chat", icon: <QuestionAnswerRoundedIcon /> },
    ],
  },
  {
    group: "Maintenance",
    items: [
      { href: "/brand", label: "Brand", icon: <ShoppingCartRoundedIcon /> },
      { href: "/category", label: "Category", icon: <AssignmentRoundedIcon /> },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        href: "/supplier",
        label: "Supplier Admin",
        icon: <SupervisorAccountIcon />,
      },
      { href: "/supplier-user", label: "Supplier User", icon: <PersonIcon /> },
      {
        href: "/user-management",
        label: "User Management",
        icon: <ManageAccountsIcon />,
      },
    ],
  },
];

export default function Sidebar({ open, user, toggleSidebar }) {
  const { logout } = useAuth({
    middleware: "auth",
  });
  const pathname = usePathname();

  return (
    open && (
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
          width: "var(--Sidebar-width)",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FEFEFE",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%232A2ADD'/%3E%3Cstop offset='1' stop-color='%23FEFEFE'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'%3E%3Cstop offset='0' stop-color='%23000000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000000' stop-opacity='0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.4'%3E%3Ccircle fill='url(%23b)' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          boxShadow: "xl",
        }}
      >
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            onClick={() => toggleSidebar()}
            variant="plain"
            size="sm"
            sx={{ display: { xs: "flex", md: "flex", lg: "flex" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src="/SRM.png" alt="NYKJV-SRM-Logo" width={170} height={170} />
        </Box>

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
                          <Typography level="title-sm">
                            {route.label}
                          </Typography>
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
            src={"/user.png"}
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
              Hi, {user?.f_name} {user?.l_name}
            </Typography>
            <Typography level="body-xs" color="neutral.500">
              {user?.email}
            </Typography>
          </Box>
          <Tooltip title="Logout">
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
          </Tooltip>
        </Box>
      </Sheet>
    )
  );
}
