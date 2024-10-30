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
import axios from "@/lib/axios";
import UserListModal from "./UserListModal";

export default function ChatsPane(props) {
  const { chats, setSelectedChat, selectedChatId } = props;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredChats, setFilteredChats] = React.useState(chats);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = chats.filter((chat) =>
      chat.sender.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  const onSelectUser = (user) => {
    // Check if a chat with this user already exists
    const existingChat = props.chats.find(chat => chat.id === `chat_${user.id}`);

    if (existingChat) {
      // If the chat already exists, just select it
      setSelectedChat(existingChat);
    } else {
      // If not, create a new chat object for the selected user
      const newChat = {
        id: `chat_${user.id}`,
        sender: {
          name: user.name,
          username: user.email,
          avatar: user.picture || "/static/images/avatar/default.jpg",
          online: true,
        },
        messages: [],
      };

      // Update the chats state by appending the new chat
      setSelectedChat(newChat);
      props.chats.push(newChat);
    }

    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: { sm: "calc(100dvh - var(--Header-height))", md: "100dvh" },
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
        {selectedChatId &&
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              {...chat}
              setSelectedChat={setSelectedChat}
              selectedChatId={selectedChatId}
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
