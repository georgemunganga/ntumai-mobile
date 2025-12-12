// Chat service for in-app messaging
import { websocketService } from './websocket';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  message: string;
  attachments?: string[];
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'location' | 'system';
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantPhoto?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isActive: boolean;
}

class ChatService {
  private chats: Map<string, Chat> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private typingUsers: Map<string, boolean> = new Map();

  /**
   * Get or create chat
   */
  async getOrCreateChat(
    participantId: string,
    participantName: string,
    participantPhoto?: string
  ): Promise<Chat> {
    // Check if chat already exists
    for (const chat of this.chats.values()) {
      if (chat.participantId === participantId) {
        return chat;
      }
    }

    // Create new chat
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newChat: Chat = {
      id: chatId,
      participantId,
      participantName,
      participantPhoto,
      unreadCount: 0,
      isActive: true,
    };

    this.chats.set(chatId, newChat);
    this.messages.set(chatId, []);

    return newChat;
  }

  /**
   * Get all chats
   */
  getAllChats(): Chat[] {
    return Array.from(this.chats.values()).sort(
      (a, b) =>
        new Date(b.lastMessageTime || 0).getTime() -
        new Date(a.lastMessageTime || 0).getTime()
    );
  }

  /**
   * Get chat by ID
   */
  getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }

  /**
   * Get messages for chat
   */
  getMessages(chatId: string): ChatMessage[] {
    return this.messages.get(chatId) || [];
  }

  /**
   * Send message
   */
  async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    message: string,
    attachments?: string[],
    senderPhoto?: string
  ): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      senderName,
      senderPhoto,
      message,
      attachments,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text',
    };

    // Add to local storage
    const chatMessages = this.messages.get(chatId) || [];
    chatMessages.push(newMessage);
    this.messages.set(chatId, chatMessages);

    // Update chat
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.lastMessage = message;
      chat.lastMessageTime = newMessage.timestamp;
    }

    // Emit via WebSocket
    websocketService.emitMessage(chatId, message, attachments);

    return newMessage;
  }

  /**
   * Receive message
   */
  receiveMessage(message: ChatMessage): void {
    const chatMessages = this.messages.get(message.chatId) || [];
    chatMessages.push(message);
    this.messages.set(message.chatId, chatMessages);

    // Update chat
    const chat = this.chats.get(message.chatId);
    if (chat) {
      chat.lastMessage = message.message;
      chat.lastMessageTime = message.timestamp;
      chat.unreadCount += 1;
    }
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(chatId: string, messageId: string): void {
    const messages = this.messages.get(chatId) || [];
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      message.isRead = true;
    }
  }

  /**
   * Mark all messages as read
   */
  markAllMessagesAsRead(chatId: string): void {
    const messages = this.messages.get(chatId) || [];
    messages.forEach((m) => {
      m.isRead = true;
    });

    const chat = this.chats.get(chatId);
    if (chat) {
      chat.unreadCount = 0;
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(chatId: string, isTyping: boolean): void {
    websocketService.emitTyping(chatId, isTyping);
  }

  /**
   * Receive typing indicator
   */
  receiveTypingIndicator(chatId: string, userId: string, isTyping: boolean): void {
    const key = `${chatId}_${userId}`;
    if (isTyping) {
      this.typingUsers.set(key, true);
    } else {
      this.typingUsers.delete(key);
    }
  }

  /**
   * Get typing users
   */
  getTypingUsers(chatId: string): string[] {
    const typingUsers: string[] = [];
    for (const [key, isTyping] of this.typingUsers.entries()) {
      if (isTyping && key.startsWith(chatId)) {
        typingUsers.push(key.split('_')[1]);
      }
    }
    return typingUsers;
  }

  /**
   * Delete chat
   */
  deleteChat(chatId: string): void {
    this.chats.delete(chatId);
    this.messages.delete(chatId);
  }

  /**
   * Clear all messages in chat
   */
  clearChatMessages(chatId: string): void {
    this.messages.set(chatId, []);
  }

  /**
   * Search messages
   */
  searchMessages(chatId: string, query: string): ChatMessage[] {
    const messages = this.messages.get(chatId) || [];
    return messages.filter((m) =>
      m.message.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get unread count
   */
  getTotalUnreadCount(): number {
    let total = 0;
    for (const chat of this.chats.values()) {
      total += chat.unreadCount;
    }
    return total;
  }

  /**
   * Send location message
   */
  async sendLocationMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    latitude: number,
    longitude: number,
    senderPhoto?: string
  ): Promise<ChatMessage> {
    const locationMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      senderName,
      senderPhoto,
      message: `ð Location: ${latitude}, ${longitude}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'location',
      attachments: [`geo:${latitude},${longitude}`],
    };

    const chatMessages = this.messages.get(chatId) || [];
    chatMessages.push(locationMessage);
    this.messages.set(chatId, chatMessages);

    return locationMessage;
  }

  /**
   * Send image message
   */
  async sendImageMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    imageUri: string,
    senderPhoto?: string
  ): Promise<ChatMessage> {
    const imageMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      senderName,
      senderPhoto,
      message: 'ð· Image',
      attachments: [imageUri],
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'image',
    };

    const chatMessages = this.messages.get(chatId) || [];
    chatMessages.push(imageMessage);
    this.messages.set(chatId, chatMessages);

    return imageMessage;
  }
}

export const chatService = new ChatService();

