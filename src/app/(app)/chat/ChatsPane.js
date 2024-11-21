import * as React from "react";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import {
  Box,
  Chip,
  IconButton,
  Input,
  Modal,
  ModalClose,
  List as JoyList,
} from "@mui/joy";
import List from "@mui/joy/List";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatListItem from "./ChatListItem";
import { toggleMessagesPane } from "@/utils";
import UserListModal from "./UserListModal";
import { useChat } from "@/stores/ChatContext";
import { useState } from "react";

export default function ChatsPane(props) {
  const {
    chats,
    onSelectUser,
    selectedChat,
    setSelectedChat,
    currentUser,
    onlineUsers,
    unreadCounts,
    lastMessage
  } = useChat();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredChats, setFilteredChats] = useState(chats);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredChats(
      chats.filter(({ participants }) =>
        participants.some(({ sender }) =>
          sender.full_name.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  };

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: { sm: "calc(100dvh - var(--Header-height))", md: "94dvh" },
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography
          component="h1"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: "span" } }}
            >
              {filteredChats.length}
            </Chip>
          }
          sx={{
            fontSize: { xs: "md", md: "lg" },
            fontWeight: "lg",
            mr: "auto",
          }}
        >
          Messages
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "none", sm: "unset" } }}
          onClick={() => setIsModalOpen(true)}
        >
          <EditNoteRoundedIcon />
        </IconButton>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: "none" } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Box>
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            user={currentUser}
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
            lastMessage={lastMessage}
          />
        ))}
      </List>
      <UserListModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={onSelectUser}
      />
    </Sheet>
  );
}
