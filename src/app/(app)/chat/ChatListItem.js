import * as React from "react";
import Box from "@mui/joy/Box";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import AvatarWithStatus from "./AvatarWithStatus";
import { toggleMessagesPane } from "@/utils";
import { useAuth } from "@/hooks/auth";
import Badge from "@mui/joy/Badge";

export default function ChatListItem(props) {
  const {
    selectedChat,
    setSelectedChat,
    user: currentUser,
    onlineUsers,
    unreadCounts,
    chat,
  } = props;
  const { id, participants, messages } = chat;

  const { user } = participants.find(
    (participant) => participant.user_id !== currentUser.id
  );
  const lastMessage = messages[messages.length - 1];
  //check if user is online
  const isOnline = user ? onlineUsers?.has(user.id) : false;

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            setSelectedChat(props.chat);
          }}
          selected={selectedChat?.id === id}
          color="neutral"
          sx={{ flexDirection: "column", alignItems: "initial", gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus
              online={isOnline}
              src={user?.profile_photo_url}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{user.full_name}</Typography>
              <Typography level="body-sm">{user.email}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: "right", paddingRight: 1 }}>
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: "none", md: "block" } }}
              >
                {lastMessage?.created_at
                  ? new Date(lastMessage.created_at).toLocaleString()
                  : ""}
              </Typography>
              {unreadCounts[id] > 0 && (
                <Badge badgeContent={unreadCounts[id]}></Badge>
              )}
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lastMessage?.content}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}
