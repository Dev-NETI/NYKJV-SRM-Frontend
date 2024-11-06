"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios";
import useEcho from "@/hooks/useEcho";
import { useAuth } from "@/hooks/auth";
import { chatService } from "@/hooks/api/chats";
import { useRef } from "react";

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

  useEffect(() => {
    if (echo && user) {
      fetchInitialData();
    }
  }, [echo, user]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
      markMessagesAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchInitialData = async () => {
    try {
      const [fetchedUsers, fetchedChats] = await Promise.all([
        chatService.fetchUsers(),
        chatService.fetchChats(),
      ]);

      setUsers(fetchedUsers);
      setChats(fetchedChats);

      if (echo) {
        // Join presence channel if not already joined
        const presenceChannelName = 'presence-chat';
        if (!joinedChannels.current.has(presenceChannelName)) {
          echo
            .join(presenceChannelName)
            .here((users) => {
              setOnlineUsers(new Set(users.map((user) => user.id)));
            })
            .joining((user) => {
              setOnlineUsers((prev) => new Set(prev.add(user.id)));
            })
            .leaving((user) => {
              setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(user.id);
                return newSet;
              });
            });
          joinedChannels.current.add(presenceChannelName);
        }

        // Join private channels for each chat
        fetchedChats.forEach((chat) => {
          const channelName = `chat.${chat.id}`;
          if (!joinedChannels.current.has(channelName)) {
            console.log("Joining channel:", channelName);
            echo.private(channelName).listenForWhisper("MessageSent", (e) => {
              if (e.sender.id === user.id) return;

              const newMessage = {
                id: e.id,
                content: e.content,
                created_at: e.created_at,
                sender: e.sender,
              };

              // Update messages if this is the selected chat
              if (selectedChat?.id === chat.id) {
                setMessages((prev) => [...prev, newMessage]);
              }

              // Update the chat's messages in the chats list
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

              // Update unread counts for non-selected chats
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
      }

      // Initialize unread counts
      const counts = {};
      fetchedChats.forEach((chat) => {
        counts[chat.id] = chat.unread_count || 0;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };


  // Cleanup function for echo channels
  useEffect(() => {
    return () => {
      if (echo) {
        // Leave all channels on unmount
        Object.keys(echo.connector.channels).forEach((channelName) => {
          echo.leaveChannel(channelName);
        });
        // Clear joined channels set
        joinedChannels.current.clear();
      }
    };
  }, [echo]);


  const sendMessage = async (content, chat) => {
    if (!echo || !chat) return;

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
      console.error("Error sending message:", error);
    }
  };
  const updateChat = (chatId, newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  };

  const onSelectUser = (selectedUser) => {
    // Find if there's an existing chat with the selected user
    const existingChat = chats.find((chat) =>
      chat.participants.some(
        (participant) => participant.sender.id === selectedUser.id
      )
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create new chat session if none exists
      newSession(selectedUser.id);
    }
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      await axios.post(`/api/messages/mark-read`, {
        chat_id: chatId,
      });

      // Clear unread count for this chat
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: 0,
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
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
      }}
    >
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
