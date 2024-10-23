"use client";
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import * as React from "react";
import Sheet from "@mui/joy/Sheet";

import MessagesPane from "./MessagesPane";
import ChatsPane from "./ChatsPane";
import useSWR from 'swr';
import axios from '@/lib/axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function ChatPage() {
  const { data: chats, error, isLoading } = useSWR('/api/chats', fetcher);
  const [selectedChat, setSelectedChat] = React.useState(null);
 

  

  if (isLoading) return <div>Loading chats...</div>;
  if (error) return <div>Error loading chats</div>; 


  return (
    <CssVarsProvider disableTransitionOnChange> 
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
          <ChatsPane
            chats={chats}
            selectedChatId={selectedChat?.id}
            setSelectedChat={setSelectedChat}
          />
        </Sheet>
       { selectedChat && <MessagesPane chat={selectedChat} />}
      </Sheet>
      </CssVarsProvider>
    
  );
}
