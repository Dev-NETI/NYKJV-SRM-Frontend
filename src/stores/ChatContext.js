"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios";
import useEcho from "@/hooks/useEcho";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const echo = useEcho();

  useEffect(() => {
    if (selectedChat && echo) {
      // Join the private chat channel
      echo
        .private(`chat.${selectedChat.id}`)
        .listen("client-MessageSent", (e) => {
          setMessages((prevMessages) => [...prevMessages, e.content]);
        });

      // Join the presence channel
      echo
        .join("presence-chat")
        .here((users) => {
          const onlineIds = new Set(users.map((user) => user.id));
          setOnlineUsers(onlineIds);
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

      console.log(onlineUsers);

      setMessages(selectedChat?.messages);
    }

    return () => {
      if (echo && currentSessionId) {
        echo.leaveChannel(`chat.${currentSessionId}`);
      }
    };
  }, [echo, chats, currentSessionId, selectedChat]);

  useEffect(() => {
    fetchUsers();
    fetchChats();
  }, []);

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

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateSession = (sessionId, lastMessage) => {
    setSessions((prevSessions) =>
      prevSessions
        .map((session) =>
          session.session_id === sessionId
            ? {
                ...session,
                last_message: lastMessage,
                updated_at: new Date().toISOString(),
              }
            : session
        )
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
    );
  };

  const sendMessage = async (content, selectedChat) => {
    if (echo && selectedChat) {
      const channel = echo.private(`chat.${selectedChat.id}`);

      channel.whisper("MessageSent", {
        // Changed: Use 'message' as the event name
        content,
        session_id: selectedChat.id,
        created_at: new Date().toISOString(),
      });

      const newId = messages.length + 1;
      const newIdString = newId.toString();

      setMessages([
        ...messages,
        {
          id: newIdString,
          sender: "You",
          content: content,
          timestamp: "Just now",
        },
      ]);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get("/api/chats");
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  // Fetch all the available users except the current user
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle selected user
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

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentSessionId,
        setCurrentSessionId,
        addMessage,
        updateSession,
        fetchMessages,

        sendMessage,
        newSession,

        users,
        onlineUsers,
        chats,
        onSelectUser,

        setSelectedChat,
        selectedChat,
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
