"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios";
import useEcho from "@/hooks/useEcho";
import { useAuth } from "@/hooks/auth";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { user } = useAuth({ middleware: "auth" });
  const echo = useEcho();

  

  useEffect(() => {
    fetchUsers();
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  useEffect(() => {
  if (selectedChat && echo) {
    const channelName = `chat.${selectedChat.id}`;
    const existingChannel = echo.connector.channels[channelName];

    if (!existingChannel) {
      echo.private(channelName).listenForWhisper("MessageSent", (e) => {
        if (e.sender.id === user.id) return;
        
        const newMessage = {
          id: e.id,
          content: e.content,
          created_at: e.created_at,
          sender: e.sender,
        };

        // Update messages for the current chat
        setMessages(prev => [...prev, newMessage]);
        
        // Update the chat's messages in the chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === selectedChat.id
              ? { ...chat, messages: [...(chat.messages || []), newMessage] }
              : chat
          )
        );
      });
    }

    markMessagesAsRead(selectedChat.id);
  }

  // Presence channel setup
  if (echo) {
    echo
      .join("presence-chat")
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
  }

  return () => {
    if (echo && selectedChat) {
      echo.leaveChannel(`chat.${selectedChat.id}`);
    }
  };
}, [echo, selectedChat, user]);

  const newSession = async (sender_id) => {
    try {
      const response = await axios.post(`/api/chats`, {
        sender_id,
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error setting new session:", error);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const response = await axios.get(`/api/chats/${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (content, selectedChat) => {
    if (!echo || !selectedChat) return;

    try {
      // Create new message object
      const newMessage = {
        id: Date.now(), // Temporary ID
        content,
        created_at: new Date().toISOString(),
        sender: user,
      };

      // Optimistically update UI
      setMessages(prev => [...prev, newMessage]);
      
      // Update chats list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat.id
            ? { ...chat, messages: [...(chat.messages || []), newMessage] }
            : chat
        )
      );

      // Send to WebSocket
      const channel = echo.private(`chat.${selectedChat.id}`);
      channel.whisper("MessageSent", {
        ...newMessage,
        session_id: selectedChat.id,
      });

      // Save to database
      await axios.post(`/api/messages`, {
        content,
        chats_id: selectedChat.id,
      });

    } catch (error) {
      console.error("Error sending message:", error);
      // Could add error handling here (e.g., remove message from UI if save fails)
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get("/api/chats");
      setChats(response.data);

      const counts = {};
      response.data.forEach((chat) => {
        counts[chat.id] = chat.unread_count || 0;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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

  const updateLastMessage = (chatId, newMessage) => {
 
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      });
      return updatedChats;
    });
};

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentSessionId,
        setCurrentSessionId,
        fetchMessages,

        sendMessage,
        newSession,

        users,
        onlineUsers,
        chats,
        onSelectUser,
        unreadCounts,
        setSelectedChat,
        selectedChat,
        updateLastMessage,
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
