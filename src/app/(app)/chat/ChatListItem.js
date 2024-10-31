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

export default function ChatListItem(props) {
  const { selectedChat, setSelectedChat } = props;
  const { id, participants, messages } = props.item;
  const user = useAuth({ middleware: "auth" });

  const { sender } = participants.find(
    (participant) => participant.sender.id !== user.id
  );
  const lastMessage = messages[messages.length - 1];

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            setSelectedChat(props.item);
          }}
          selected={selectedChat?.id === id}
          color="neutral"
          sx={{ flexDirection: "column", alignItems: "initial", gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus
              online={sender?.is_active === 1}
              src={sender?.profile_photo_url}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{sender?.full_name}</Typography>
              <Typography level="body-sm">{sender?.email}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
              {lastMessage?.unread === 1 && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: "none", md: "block" } }}
              >
                {lastMessage?.created_at
                  ? new Date(lastMessage.created_at).toLocaleString()
                  : ""}
              </Typography>
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
