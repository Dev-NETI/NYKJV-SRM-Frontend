'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/axios';
import useEcho from '@/hooks/useEcho';


const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const echo = useEcho();

  useEffect(() => {
    if (echo && currentSessionId) {
      const channel = `chat.${currentSessionId}`;
      const existingConnection = echo.connector.channels[channel];

      if (!existingConnection) {
        echo.channel(channel)
          .listen('.NewChatSession', (e) => {
            setSessions(prevSessions => [e.session, ...prevSessions]);
          })
          .listen('.MessageSent', (e) => {
            addMessage(e.message);
            updateSession(e.message.session_id, e.message.content);
          });
      }
    }

    return () => {
      if (echo && currentSessionId) {
        echo.leaveChannel(`chat.${currentSessionId}`);
      }
    };
  }, [echo, currentSessionId]);

  

  const fetchMessages = async (sessionId) => {
    try {
      const response = await axios.get(`/api/admin/chat-sessions/${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const addMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const updateSession = (sessionId, lastMessage) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.session_id === sessionId
          ? { ...session, last_message: lastMessage, updated_at: new Date().toISOString() }
          : session
      ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    );
  };

  const sendMessage = async (content, sessionId) => {
    try {
      const response = await axios.post(`/api/admin/chat-sessions/${sessionId}/reply`, { content });
      
      updateSession(sessionId, content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/admin/chat-sessions');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        currentSessionId,
        setCurrentSessionId,
        addMessage,
        updateSession,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};