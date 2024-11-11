import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { useChat } from "@/stores/ChatContext";

export default function MessagesPane() {
  const {
    selectedChat: chat,
    onlineUsers,
    sendMessage,
    messages,
    currentUser: user,
  } = useChat();

  const [textAreaValue, setTextAreaValue] = React.useState("");

  const sender = chat?.participants.find(
    (participant) => participant.user.id !== user.id
  )?.user;
  const isOnline = sender ? onlineUsers.has(sender.id) : false;

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "94vh" },
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
                        online={isOnline}
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
