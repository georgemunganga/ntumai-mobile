// Push notification service using Firebase Cloud Messaging
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

interface NotificationData {
  type: 'order' | 'job' | 'message' | 'payment' | 'alert' | 'promotion';
  title: string;
  message: string;
  data?: Record<string, any>;
  deepLink?: string;
}

class NotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Request permissions
      await this.requestPermissions();

      // Get Expo push token
      this.expoPushToken = await this.getExpoPushToken();
      console.log('Expo Push Token:', this.expoPushToken);
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<void> {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
      }
    }
  }

  /**
   * Get Expo push token
   */
  private async getExpoPushToken(): Promise<string> {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return token.data;
    } catch (error) {
      console.error('Failed to get Expo push token:', error);
      return '';
    }
  }

  /**
   * Get push token
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(callback: (notification: Notifications.Notification) => void): void {
    this.notificationListener = Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Subscribe to notification responses (when user taps notification)
   */
  subscribeToNotificationResponses(
    callback: (response: Notifications.NotificationResponse) => void
  ): void {
    this.responseListener = Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribeFromNotifications(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(data: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.message,
          data: {
            type: data.type,
            ...data.data,
            deepLink: data.deepLink,
          },
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(
    data: NotificationData,
    delayInSeconds: number
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.message,
          data: {
            type: data.type,
            ...data.data,
            deepLink: data.deepLink,
          },
          sound: 'default',
          badge: 1,
        },
        trigger: {
          seconds: delayInSeconds,
        },
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }

  /**
   * Send job offer notification
   */
  async sendJobOfferNotification(
    jobId: string,
    pickupLocation: string,
    dropoffLocation: string,
    estimatedEarnings: number
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'job',
      title: 'ð New Job Offer!',
      message: `${pickupLocation} â ${dropoffLocation} â¢ â­${estimatedEarnings}`,
      data: {
        jobId,
        pickupLocation,
        dropoffLocation,
        estimatedEarnings,
      },
      deepLink: `ntumai://job/${jobId}`,
    });
  }

  /**
   * Send order status notification
   */
  async sendOrderStatusNotification(
    orderId: string,
    status: string,
    message: string
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'order',
      title: `Order ${status}`,
      message,
      data: {
        orderId,
        status,
      },
      deepLink: `ntumai://order/${orderId}`,
    });
  }

  /**
   * Send message notification
   */
  async sendMessageNotification(
    chatId: string,
    senderName: string,
    message: string
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'message',
      title: senderName,
      message,
      data: {
        chatId,
        senderName,
      },
      deepLink: `ntumai://chat/${chatId}`,
    });
  }

  /**
   * Send payment notification
   */
  async sendPaymentNotification(
    amount: number,
    status: 'success' | 'failed',
    message: string
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'payment',
      title: `Payment ${status === 'success' ? 'â' : 'â'}`,
      message,
      data: {
        amount,
        status,
      },
    });
  }

  /**
   * Send alert notification
   */
  async sendAlertNotification(title: string, message: string): Promise<void> {
    await this.sendLocalNotification({
      type: 'alert',
      title,
      message,
    });
  }

  /**
   * Send promotion notification
   */
  async sendPromotionNotification(
    title: string,
    message: string,
    deepLink?: string
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'promotion',
      title,
      message,
      deepLink,
    });
  }
}

export const notificationService = new NotificationService();

