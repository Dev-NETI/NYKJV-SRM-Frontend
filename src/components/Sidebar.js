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
import { Grow, Tooltip } from "@mui/material";

const routes = [
  {
    group: "Main",
    items: [
      {
        href: "/product",
        label: "Products",
        icon: <ProductionQuantityLimitsIcon />,
        allowedRoles: ["Product"],
      },
      {
        href: "/orders",
        label: "Orders",
        icon: <ShoppingCartIcon />,
        allowedRoles: ["Orders"],
      },
      {
        href: "/supplier-document/compliance",
        label: "Compliance Documents",
        icon: <ArticleIcon />,
        allowedRoles: ["Supplier Document"],
      },
      {
        href: "/supplier-document/orders",
        label: "Order Documents",
        icon: <ArticleIcon />,
        allowedRoles: ["Order Documents"],
      },
    ],
  },
  {
    group: "Communication",
    items: [
      {
        href: "/chat",
        label: "Chat",
        icon: <QuestionAnswerRoundedIcon />,
        allowedRoles: ["Admin", "Supplier", "User"],
      },
    ],
  },
  {
    group: "Maintenance",
    items: [
      {
        href: "/brand",
        label: "Brand",
        icon: <ShoppingCartRoundedIcon />,
        allowedRoles: ["Brand"],
      },
      {
        href: "/category",
        label: "Category",
        icon: <AssignmentRoundedIcon />,
        allowedRoles: ["Category"],
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        href: "/supplier",
        label: "Supplier Admin",
        icon: <SupervisorAccountIcon />,
        allowedRoles: ["Supplier Admin"],
      },
      {
        href: "/user-management",
        label: "User Management",
        icon: <ManageAccountsIcon />,
        allowedRoles: ["User Management"],
      },
    ],
  },
];

export default function Sidebar({ open, user, toggleSidebar }) {
  const { logout } = useAuth({
    middleware: "auth",
  });
  const pathname = usePathname();

  // Add a check to safely access the role name
  const userRoles = user?.role_users?.map((role) => role.role?.name) || [];

  // Filter routes based on user roles
  const filteredRoutes = routes
    .map((group) => ({
      ...group,
      items: group.items.filter((route) =>
        route.allowedRoles.some((role) => userRoles.includes(role))
      ),
    }))
    .filter((group) => group.items.length > 0);

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
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FFF",
          boxShadow: "xl",
          overflow: "visible",
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
          <Image
            src="/SRM.png"
            alt="NYKJV-SRM-Logo"
            width={170}
            height={170}
            priority={true}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            flex: 1,
            overflow: "hidden auto",
          }}
        >
          {filteredRoutes.map((group) => (
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
                  {group.items.map((route, index) => (
                    <Grow
                      in={true}
                      timeout={index * 200 + 200}
                      key={route.href}
                    >
                      <ListItem>
                        <ListItemButton
                          component={Link}
                          href={route.href}
                          selected={pathname === route.href}
                          sx={{
                            marginTop: 1,
                            marginRight: 0.2,
                            gap: 1.5,
                            borderRadius: 10,
                            transition: "transform 0.2s, box-shadow 0.3s",
                            "&.Mui-selected": {
                              backgroundColor: "darkblue", // Dark blue for the selected item
                              color: "white", // White text color for the selected item
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              transform: "scale(1.02)",
                              "&:hover": {
                                backgroundColor: "darkblue", // Keep dark blue when hovering over selected
                                color: "white", // Ensure text stays white when hovering over selected
                                transform: "scale(1.05)",
                              },
                            },
                            "&:hover": {
                              backgroundColor: "transparent", // No background change on hover for non-selected
                              color: "inherit", // Keep default text color for non-selected
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              transform: "scale(1.03)",
                            },
                          }}
                        >
                          {route.icon}
                          <ListItemContent>
                            <Typography level="title-sm" color="inherit">
                              {route.label}
                            </Typography>
                          </ListItemContent>
                        </ListItemButton>
                      </ListItem>
                    </Grow>
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
            boxShadow: "lg",
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
