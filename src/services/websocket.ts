// Real-time communication service using Socket.io
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/src/api/config';

interface WebSocketEvents {
  'location-update': (data: { taskerId: string; latitude: number; longitude: number; timestamp: string }) => void;
  'message': (data: { chatId: string; senderId: string; message: string; timestamp: string }) => void;
  'job-offer': (data: { jobId: string; pickupLocation: string; dropoffLocation: string; estimatedEarnings: number; expiresIn: number }) => void;
  'order-status': (data: { orderId: string; status: string; timestamp: string }) => void;
  'notification': (data: { id: string; type: string; title: string; message: string; timestamp: string }) => void;
  'typing': (data: { chatId: string; userId: string; isTyping: boolean }) => void;
  'call-incoming': (data: { callId: string; callerId: string; callerName: string; callerPhoto: string }) => void;
  'call-ended': (data: { callId: string; duration: number }) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Initialize WebSocket connection
   */
  connect(userId: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(API_CONFIG.WEBSOCKET_URL, {
          auth: {
            token,
            userId,
          },
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: 10000,
          reconnectionAttempts: this.maxReconnectAttempts,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log('WebSocket connected');
          resolve();
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
          console.log('WebSocket disconnected');
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          if (this.reconnectAttempts === 0) {
            reject(error);
          }
        });

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  isConnectedStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Subscribe to location updates
   */
  onLocationUpdate(callback: WebSocketEvents['location-update']): void {
    if (this.socket) {
      this.socket.on('location-update', callback);
    }
  }

  /**
   * Subscribe to messages
   */
  onMessage(callback: WebSocketEvents['message']): void {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  /**
   * Subscribe to job offers
   */
  onJobOffer(callback: WebSocketEvents['job-offer']): void {
    if (this.socket) {
      this.socket.on('job-offer', callback);
    }
  }

  /**
   * Subscribe to order status updates
   */
  onOrderStatus(callback: WebSocketEvents['order-status']): void {
    if (this.socket) {
      this.socket.on('order-status', callback);
    }
  }

  /**
   * Subscribe to notifications
   */
  onNotification(callback: WebSocketEvents['notification']): void {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  /**
   * Subscribe to typing indicators
   */
  onTyping(callback: WebSocketEvents['typing']): void {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  /**
   * Subscribe to incoming calls
   */
  onCallIncoming(callback: WebSocketEvents['call-incoming']): void {
    if (this.socket) {
      this.socket.on('call-incoming', callback);
    }
  }

  /**
   * Subscribe to call ended
   */
  onCallEnded(callback: WebSocketEvents['call-ended']): void {
    if (this.socket) {
      this.socket.on('call-ended', callback);
    }
  }

  /**
   * Emit location update
   */
  emitLocationUpdate(latitude: number, longitude: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('location-update', {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Emit message
   */
  emitMessage(chatId: string, message: string, attachments?: string[]): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('message', {
        chatId,
        message,
        attachments,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Emit typing indicator
   */
  emitTyping(chatId: string, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        chatId,
        isTyping,
      });
    }
  }

  /**
   * Accept job offer
   */
  acceptJobOffer(jobId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('job-accept', { jobId });
    }
  }

  /**
   * Reject job offer
   */
  rejectJobOffer(jobId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('job-reject', { jobId });
    }
  }

  /**
   * Initiate call
   */
  initiateCall(recipientId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('call-initiate', { recipientId });
    }
  }

  /**
   * End call
   */
  endCall(callId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('call-end', { callId });
    }
  }

  /**
   * Unsubscribe from event
   */
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const websocketService = new WebSocketService();

