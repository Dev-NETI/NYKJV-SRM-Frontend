import axios from '@/lib/axios';

export const chatService = {
    async fetchChats() {
      const response = await axios.get('/api/chats');
      return response.data;
    },
  
    async fetchMessages(sessionId) {
      const response = await axios.get(`/api/chats/${sessionId}`);
      return response.data;
    },
  
    async sendMessage(content, chatId) {
      const response = await axios.post(`/api/messages`, {
        content,
        chats_id: chatId,
      });
      return response.data;
    },
  
    async newSession(senderId) {
      const response = await axios.post(`/api/chats`, {
        sender_id: senderId,
      });
      return response.data;
    },
  
    async markMessagesAsRead(chatId) {
      await axios.post(`/api/messages/mark-read`, {
        chat_id: chatId,
      });
    },
  
    async fetchUsers() {
      const response = await axios.get('/api/chat/users');
      return response.data;
    },
  };