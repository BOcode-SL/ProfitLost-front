import { Notification, NotificationPreferences, NotificationType, NotificationMetadata } from '../types/models/notification';

/**
 * Service to handle operations related to notifications
 * Note: This service is simulated to work with test data
 */
class NotificationService {
    /**
     * Retrieves all notifications for the current user
     */
    async getNotifications(): Promise<Notification[]> {
        // This function is simulated in the NotificationsInbox component
        return [];
    }

    /**
     * Marks a notification as read
     * @param notificationId ID of the notification
     */
    async markAsRead(_id: string): Promise<Notification> {
        // This function is simulated in the NotificationsInbox component
        console.log('Marking as read:', _id);
        throw new Error('Function simulated in the component');
    }

    /**
     * Marks all notifications as read
     */
    async markAllAsRead(): Promise<void> {
        // This function is simulated in the NotificationsInbox component
        throw new Error('Function simulated in the component');
    }

    /**
     * Archives a notification
     * @param notificationId ID of the notification
     */
    async archiveNotification(_id: string): Promise<Notification> {
        // This function is simulated in the NotificationsInbox component
        console.log('Archiving notification:', _id);
        throw new Error('Function simulated in the component');
    }

    /**
     * Deletes a notification
     * @param notificationId ID of the notification
     */
    async deleteNotification(_id: string): Promise<void> {
        // This function is simulated in the NotificationsInbox component
        console.log('Deleting notification:', _id);
        throw new Error('Function simulated in the component');
    }

    /**
     * Retrieves the user's notification preferences
     */
    async getNotificationPreferences(): Promise<NotificationPreferences> {
        // Simulating an API call
        return {
            inApp: {
                enabled: true,
                types: {
                    payment_reminder: true,
                    achievement: true,
                    goal_progress: true,
                    tip: true,
                    system: true,
                    announcement: true
                }
            },
            email: {
                enabled: true,
                types: {
                    payment_reminder: true,
                    achievement: true,
                    goal_progress: true,
                    tip: false,
                    system: false,
                    announcement: true
                }
            }
        };
    }

    /**
     * Updates the user's notification preferences
     * @param preferences New notification preferences
     */
    async updateNotificationPreferences(preferences: NotificationPreferences): Promise<NotificationPreferences> {
        // Simulating an API call
        console.log('Updating notification preferences:', preferences);
        return preferences;
    }

    /**
     * Retrieves the number of unread notifications
     */
    async getUnreadCount(): Promise<number> {
        // Simulating an API call
        return Math.floor(Math.random() * 10);
    }

    /**
     * Filters notifications by type
     * @param notifications List of notifications
     * @param type Type of notification to filter ('all' for all)
     */
    filterByType(notifications: Notification[], type: NotificationType | 'all'): Notification[] {
        if (type === 'all') {
            return notifications;
        }
        return notifications.filter(notification => notification.type === type);
    }

    /**
     * Creates a new notification with HTML content
     * @param title Title of the notification
     * @param message Short message of the notification
     * @param type Type of notification
     * @param content Extended HTML content (optional)
     * @param metadata Additional metadata (optional)
     */
    async createNotification(
        title: string, 
        message: string, 
        type: NotificationType, 
        content?: string, 
        metadata?: NotificationMetadata
    ): Promise<Notification> {
        // This function is simulated
        console.log('Creating notification:', { title, message, type, content, metadata });
        
        // In a real environment, an API call would be made here
        const mockNotification: Notification = {
            _id: Math.random().toString(36).substring(2, 15),
            user_id: 'current_user_id',
            type,
            title,
            message,
            status: 'unread',
            origin: 'manual',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            content,
            metadata
        };
        
        return mockNotification;
    }
}

export default new NotificationService(); 