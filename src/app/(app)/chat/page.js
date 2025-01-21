"use client";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Sheet from "@mui/joy/Sheet";
import MessagesPane from "./MessagesPane";
import ChatsPane from "./ChatsPane";
import { ChatProvider } from "@/stores/ChatContext";

export default function ChatPage() {
  return (
    
    <CssVarsProvider disableTransitionOnChange>
      <ChatProvider>
        <CssBaseline />
        <Sheet
          sx={{
            flex: 1,
            width: "100%",
            mx: "auto",
            pt: { xs: "var(--Header-height)", md: 0 },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(min-content, min(30%, 400px)) 1fr",
            },
          }}
        >
          <Sheet
            sx={{
              position: { xs: "fixed", sm: "sticky" },
              transform: {
                xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
                sm: "none",
              },
              transition: "transform 0.4s, width 0.4s",
              zIndex: 100,
              width: "100%",
            }}
          >
            <ChatsPane />
          </Sheet>
          <MessagesPane />
        </Sheet>
      </ChatProvider>
    </CssVarsProvider>
  );
}
