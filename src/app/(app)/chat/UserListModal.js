import * as React from "react";
import {
  Modal,
  ModalClose,
  Sheet,
  Typography,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Avatar,
} from "@mui/joy";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useChat } from "@/stores/ChatContext";
export default function UserListModal({ open, onClose, onSelectUser }) {
  const { users } = useChat();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          width: "100%",
          maxHeight: "80vh",
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          overflowY: "auto",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Select a User
        </Typography>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List>
          {filteredUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemButton
                onClick={() => {
                  onSelectUser(user);
                  // Close the modal
                 onClose();
                }}
              >
                <Avatar src={user.picture} sx={{ mr: 2 }} />
                <ListItemContent>
                  <Typography level="body1">{user.name}</Typography>
                  <Typography level="body2" color="neutral">
                    {user.email}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Sheet>
    </Modal>
  );
}
