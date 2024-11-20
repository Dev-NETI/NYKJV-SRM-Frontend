"use client";

import React from "react";
import { Box, Typography } from "@mui/joy";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0, // Ensures it starts from the left edge
        width: "100%", // Always takes full width of the screen
        borderTop: "1px solid",
        borderColor: "divider",
        py: 1.5,
        px: 3,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "background.surface",
        backdropFilter: "blur(6px)",
        zIndex: 50,
      }}
    >
      <Typography
        level="body-sm"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          width: "100%",
          fontWeight: 500,
        }}
      >
        © {currentYear} Supplier Relationship Management. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
