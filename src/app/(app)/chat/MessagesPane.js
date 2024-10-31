import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { useAuth } from "@/hooks/auth";
import { useChat } from "@/stores/ChatContext";
import { useEffect } from "react";

export default function MessagesPane() {
  const { selectedChat: chat, onlineUsers, sendMessage, messages } = useChat();
  const user = useAuth({ middleware: "auth" });

   
  const [textAreaValue, setTextAreaValue] = React.useState("");

 

  const sender = chat?.participants.find(
    (participant) => participant.sender.id !== user.id
  )?.sender;
  const isOnline = sender ? onlineUsers.has(sender.id) : false;

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      {chat && (
        <>
          <MessagesPaneHeader sender={sender} isOnline={isOnline} />
          <Box
            sx={{
              display: "flex",
              flex: 1,
              minHeight: 0,
              px: 2,
              py: 3,
              overflowY: "scroll",
              flexDirection: "column-reverse",
            }}
          >
            <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
              {messages?.map((message, index) => {
                const isYou = message.sender.id === user.id;
                return (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
                  >
                    {message?.sender !== "You" && (
                      <AvatarWithStatus
                        online={message.sender.online}
                        src={message.sender.avatar}
                      />
                    )}
                    <ChatBubble
                      variant={isYou ? "sent" : "received"}
                      {...message}
                    />
                  </Stack>
                );
              })}
            </Stack>
          </Box>
          <MessageInput
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
            onSubmit={() => {
            
              sendMessage(textAreaValue, chat);
             
            }}
          />
        </>
      )}
    </Sheet>
  );
}
