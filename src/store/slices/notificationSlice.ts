// @ts-nocheck
import { create } from 'zustand';
import { mockNotificationService } from '@/src/api/mockServices';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface Notification {
  id: string;
  userId: string;
  type: 'order_update' | 'delivery' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationStore extends NotificationState {
  // Notification actions
  fetchNotifications: (userId: string, limit?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<NotificationStore>()(
  createPersistentStore(
    (set, get) => ({
      ...initialState,

      fetchNotifications: async (userId: string, limit: number = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockNotificationService.getNotifications(userId, limit);
          if (response.success) {
            const unreadCount = response.data.filter((n: Notification) => !n.isRead).length;
            set({
              notifications: response.data,
              unreadCount,
              isLoading: false,
            });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      markAsRead: async (notificationId: string) => {
        try {
          const response = await mockNotificationService.markAsRead(notificationId);
          if (response.success) {
            set(state => {
              const updated = state.notifications.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
              );
              const unreadCount = updated.filter(n => !n.isRead).length;
              return { notifications: updated, unreadCount };
            });
          }
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      markAllAsRead: async (userId: string) => {
        try {
          const response = await mockNotificationService.markAllAsRead(userId);
          if (response.success) {
            set(state => {
              const updated = state.notifications.map(n => ({ ...n, isRead: true }));
              return { notifications: updated, unreadCount: 0 };
            });
          }
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      deleteNotification: async (notificationId: string) => {
        try {
          const response = await mockNotificationService.deleteNotification(notificationId);
          if (response.success) {
            set(state => {
              const updated = state.notifications.filter(n => n.id !== notificationId);
              const unreadCount = updated.filter(n => !n.isRead).length;
              return { notifications: updated, unreadCount };
            });
          }
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      addNotification: (notification: Notification) => {
        set(state => {
          const updated = [notification, ...state.notifications];
          const unreadCount = updated.filter(n => !n.isRead).length;
          return { notifications: updated, unreadCount };
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
