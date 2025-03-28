"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "@/lib/axios";
import useEcho from "@/hooks/useEcho";
import { useAuth } from "@/hooks/auth";
import { chatService } from "@/hooks/api/chats";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const joinedChannels = useRef(new Set());

  const { user } = useAuth({ middleware: "auth" });
  const echo = useEcho();

  const fetchInitialData = useCallback(async () => {
    if (!user || !echo) return;

    try {
      const [fetchedUsers, fetchedChats] = await Promise.all([
        chatService.fetchUsers(),
        chatService.fetchChats(),
      ]);

      setUsers(fetchedUsers);
      setChats(fetchedChats);

      const presenceChannelName = "presence-chat";
      if (!joinedChannels.current.has(presenceChannelName)) {
        echo
          .join(presenceChannelName)
          .here((users) => {
            setOnlineUsers(new Set(users.map((u) => u.id)));
          })
          .joining((u) => {
            setOnlineUsers((prev) => new Set(prev.add(u.id)));
          })
          .leaving((u) => {
            setOnlineUsers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(u.id);
              return newSet;
            });
          });
        joinedChannels.current.add(presenceChannelName);
      }

      fetchedChats.forEach((chat) => {
        const channelName = `chat.${chat.id}`;
        if (!joinedChannels.current.has(channelName)) {
          console.log("Joining channel:", channelName);
          echo.private(channelName).listenForWhisper("MessageSent", (e) => {
            if (e.sender?.id === user?.id) return;

            const newMessage = {
              id: e.id,
              content: e.content,
              created_at: e.created_at,
              sender: e.sender,
            };

            setMessages((prev) => [...prev, newMessage]);

            setChats((prevChats) =>
              prevChats.map((c) =>
                c.id === chat.id
                  ? {
                      ...c,
                      messages: [...(c.messages || []), newMessage],
                      last_message: newMessage,
                    }
                  : c
              )
            );

            if (selectedChat?.id !== chat.id) {
              setUnreadCounts((prev) => ({
                ...prev,
                [chat.id]: (prev[chat.id] || 0) + 1,
              }));
            }
          });
          joinedChannels.current.add(channelName);
        }
      });

      const counts = {};
      fetchedChats.forEach((chat) => {
        counts[chat.id] = chat.unread_count || 0;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error("Error fetching initial data");
    }
  }, [echo, selectedChat?.id, user]);

  useEffect(() => {
    if (echo && user) {
      fetchInitialData();
    }
  }, [echo, user, fetchInitialData]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
      markMessagesAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    const joinedChannelsSnapshot = joinedChannels.current;
    return () => {
      if (echo) {
        Object.keys(echo.connector.channels).forEach((channelName) => {
          echo.leaveChannel(channelName);
        });
        joinedChannelsSnapshot.clear();
      }
    };
  }, [echo]);

  const sendMessage = async (content, chat) => {
    if (!echo || !chat || !user) return;

    try {
      const newMessage = {
        id: Date.now(),
        content,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        sender: user,
      };

      setMessages((prev) => [...prev, newMessage]);
      updateChat(chat.id, newMessage);

      const channel = echo.private(`chat.${chat.id}`);
      channel.whisper("MessageSent", {
        ...newMessage,
        session_id: chat.id,
      });

      await chatService.sendMessage(content, chat.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Error sending message");
    }
  };

  const updateChat = (chatId, newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...(chat.messages || []), newMessage],
              last_message: newMessage,
            }
          : chat
      )
    );
  };

  const onSelectUser = async (selectedUser) => {
    if (!selectedUser) return;

    try {
      const existingChat = chats.find((chat) =>
        chat.participants?.some(
          (participant) => participant.user?.id === selectedUser.id
        )
      );

      if (existingChat) {
        setSelectedChat(existingChat);
      } else {
        const newChat = await chatService.newSession(selectedUser.id);
        setChats((prev) => [...prev, newChat]);
        setSelectedChat(newChat);
      }
    } catch (error) {
      console.error('Error selecting user:', error);
      toast.error("Error creating chat session");
    }
  };

  const markMessagesAsRead = async (chatId) => {
    if (!chatId) return;

    try {
      await axios.post(`/api/messages/mark-read`, {
        chat_id: chatId,
      });

      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: 0,
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
      toast.error("Error marking messages as read");
    }
  };

  const addParticipantToChat = async (chatId, userId) => {
    if (!chatId || !userId) return;

    try {
      await axios.post(`/api/chats/${chatId}/participants`, {
        user_id: userId,
      });

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === chatId) {
            const newParticipant = users.find((u) => u.id === userId);
            return {
              ...chat,
              participants: [
                ...(chat.participants || []),
                {
                  user: newParticipant,
                  chat_id: chatId,
                },
              ],
            };
          }
          return chat;
        })
      );

      if (selectedChat?.id === chatId) {
        setSelectedChat((prev) => ({
          ...prev,
          participants: [
            ...(prev.participants || []),
            {
              user: users.find((u) => u.id === userId),
              chat_id: chatId,
            },
          ],
        }));
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      toast.error("Error adding participant");
    }
  };

  const removeParticipantFromChat = async (chatId, userId) => {
    if (!chatId || !userId) return;

    try {
      await axios.delete(`/api/chats/${chatId}/participants/${userId}`);

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              participants: chat.participants?.filter(
                (p) => p.user?.id !== userId
              ) || [],
            };
          }
          return chat;
        })
      );

      if (selectedChat?.id === chatId) {
        setSelectedChat((prev) => ({
          ...prev,
          participants: prev.participants?.filter(
            (p) => p.user?.id !== userId
          ) || [],
        }));
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error("Error removing participant");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentSessionId,
        setCurrentSessionId,
        sendMessage,
        users,
        onlineUsers,
        chats,
        onSelectUser,
        unreadCounts,
        setSelectedChat,
        selectedChat,
        currentUser: user,
        addParticipantToChat,
        removeParticipantFromChat,
      }}
    >
      <ToastContainer />
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};