import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { useChat } from "@/stores/ChatContext";
import UserListModal from "./UserListModal";

export default function MessagesPaneHeader({ sender, isOnline }) {
  const {
    selectedChat,
    users,
    addParticipantToChat,
    removeParticipantFromChat,
    currentUser,
  } = useChat();

  const [showUserModal, setShowUserModal] = React.useState(false);

  
 

  const handleAddParticipant = () => {
    setShowUserModal(true); 
  };

  const onSelectUserToAdd = async (user) => {
    await addParticipantToChat(selectedChat.id, user.id);
    setShowUserModal(false);
  };

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      >
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar size="lg" src={sender.profile_photo_url} />
        <div>
          <Typography
            component="h2"
            noWrap
            endDecorator={
              <Chip
                variant="outlined"
                size="sm"
                color={isOnline ? "success" : "neutral"}
                startDecorator={
                  <CircleIcon
                    sx={{ fontSize: 8 }}
                    color={isOnline ? "success" : "neutral"}
                  />
                }
              >
                {isOnline ? "Online" : "Offline"}
              </Chip>
            }
            sx={{ fontWeight: "lg", fontSize: "lg" }}
          >
            {sender.full_name}
          </Typography>
          <Typography level="body-sm">{sender.email}</Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
        <div>
          <Typography level="body-sm">
            {selectedChat?.participants.length} participants
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            {selectedChat?.participants.map((participant) => (
              <Chip
                key={participant.user.id}
                size="sm"
                variant="soft"
                color="neutral"
                 
              >
                {participant.user.full_name}
              </Chip>
            ))}
          </Stack>
        </div>
        <IconButton
          size="sm"
          variant="plain" 
          color="neutral"
          onClick={handleAddParticipant}
        >
          <PersonAddIcon /> 
        </IconButton>
      </Stack>

      {showUserModal && (
        <UserListModal
          open={showUserModal}
          onClose={() => setShowUserModal(false)}
          users={users.filter(
            (u) => !selectedChat?.participants.some((p) => p.user.id === u.id)
          )}
          onSelectUser={onSelectUserToAdd}
          title="Add Participant"
        />
      )}
    </Stack>
  );
}
