import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
    Box,
    Typography,
    Button,
    Skeleton,
    Paper,
    useTheme,
    alpha
} from '@mui/material';

// Types
import { Notification } from '../../../../../types/models/notification';

// Components
import NotificationItem from './NotificationItem';

// Mock data for notifications
const mockNotifications: Notification[] = [
    {
        _id: '1',
        user_id: 'user123',
        type: 'payment_reminder',
        title: 'Take off with bonus Miles',
        message: 'Get 20% more Miles when you redeem RevPoints with Turkish Airlines. Ends 16/03. T&Cs apply',
        status: 'unread',
        origin: 'automatic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: '2',
        user_id: 'user123',
        type: 'achievement',
        title: 'Invite friends, get paid',
        message: 'You can earn €40 for each friend you refer by March 25! T&Cs apply',
        status: 'unread',
        origin: 'automatic',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
    },
    {
        _id: '3',
        user_id: 'user123',
        type: 'goal_progress',
        title: 'Show continued support for Ukraine',
        message: 'Unlock a special edition card by donating to UNHCR before 30 March 2025. T&Cs apply',
        status: 'read',
        origin: 'automatic',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
    },
    {
        _id: '4',
        user_id: 'user123',
        type: 'tip',
        title: 'Only 7 days left',
        message: 'Earn €40 for every friend you refer by March 4. T&Cs apply',
        status: 'read',
        origin: 'automatic',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
    },
    {
        _id: '5',
        user_id: 'user123',
        type: 'announcement',
        title: '15% off train fares',
        message: 'Save money on travel across Europe with Trainline. Offer ends 28/02. T&Cs apply',
        status: 'read',
        origin: 'manual',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
    },
    {
        _id: '6',
        user_id: 'user123',
        type: 'announcement',
        title: 'New feature available',
        message: 'You can now set personalized savings goals.',
        status: 'unread',
        origin: 'manual',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        content: `🎉 We are excited to announce the launch of our <b>new feature</b> for personalized savings goals! 🎉

<p>With this new feature, you can now:</p>

<ul>
  <li>✨ <b>Create savings goals</b> with flexible target dates</li>
  <li>💰 <b>Set custom amounts</b> based on your needs</li>
  <li>🔔 <b>Receive automatic progress notifications</b></li>
  <li>📊 <b>Visualize your progress</b> with interactive charts</li>
  <li>📱 <b>Share your achievements</b> on social media</li>
</ul>

<p>This update is part of our ongoing commitment to provide you with the <b>best tools</b> for effectively managing your personal finances. 💪</p>

<p>To start using this new feature, simply go to the <b>Goals</b> section in your dashboard and click on <b>"Create new goal"</b>. 🖱️</p>

<p>If you have any questions or suggestions about this new feature, feel free to contact our <b>support team</b>. 🤝</p>

<p>We hope you enjoy this new feature and that it helps you achieve your <b>financial goals</b>! 💸</p>`
    },
    {
        _id: '7',
        user_id: 'user123',
        type: 'announcement',
        title: 'Important security update',
        message: 'We have implemented new security measures to protect your account.',
        status: 'unread',
        origin: 'manual',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        content: `<h3>Dear user,</h3>

<p>We have made an important update to our security systems to ensure the protection of your personal and financial information.</p>

<p>The improvements include:</p>

<ul>
  <li><b>Enhanced two-factor authentication</b></li>
  <li><b>End-to-end data encryption</b></li>
  <li><b>Advanced monitoring</b> of suspicious activities</li>
  <li><b>New verification protocols</b> for high-value transactions</li>
  <li><b>Real-time alerts</b> for logins from unknown devices</li>
</ul>

<p>We recommend <a href="#" style="color: #1976d2; text-decoration: underline;">updating your password</a> and reviewing your account security settings to make the most of these new features.</p>

<p>The security of your data is our number one priority, and we are constantly working to improve our protection measures.</p>

<p>If you have any questions or concerns about these updates, please do not hesitate to contact our support team.</p>

<p>Thank you for trusting us with your personal finance management.</p>`
    },
    {
        _id: '8',
        user_id: 'user123',
        type: 'tip',
        title: 'Tips to improve your finances',
        message: 'We have prepared some tips to help you improve your financial situation.',
        status: 'unread',
        origin: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: `<div style="max-width: 100%;">
  <h3 style="color: inherit; border-bottom: 2px solid currentColor; padding-bottom: 8px;">5 Tips to Improve Your Personal Finances</h3>
  
  <div style="margin: 16px 0; padding: 16px; background-color: rgba(255, 255, 255, 0.42); border-radius: 8px; border-left: 4px solid currentColor;">
    <p style="font-style: italic; margin: 0;">
      "Money can't buy happiness, but it provides a sense of security that allows you to pursue what truly makes you happy."
    </p>
  </div>
  
  <ol style="padding-left: 20px;">
    <li style="margin-bottom: 16px;">
      <h4 style="color: inherit; margin-bottom: 8px;">Create a detailed budget</h4>
      <p>A budget helps you <b>visualize your income and expenses</b>. Take time to categorize your expenses and set realistic limits for each category.</p>
      <div style="background-color: rgba(230, 255, 230, 0.42); padding: 8px; border-radius: 4px; margin-top: 8px;">
        <span style="font-weight: bold;">Pro Tip:</span> Review your budget weekly to stay on track.
      </div>
    </li>
    
    <li style="margin-bottom: 16px;">
      <h4 style="color: inherit; margin-bottom: 8px;">Establish an emergency fund</h4>
      <p>Try to save at least <b>3-6 months</b> of essential expenses in a separate account for emergencies.</p>
      <div style="display: flex; align-items: center; margin-top: 8px;">
        <span style="background-color: currentColor; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; margin-right: 8px;">✓</span>
        <span>Protects you against unexpected expenses</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 4px;">
        <span style="background-color: currentColor; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; margin-right: 8px;">✓</span>
        <span>Reduces financial stress</span>
      </div>
    </li>
    
    <li style="margin-bottom: 16px;">
      <h4 style="color: inherit; margin-bottom: 8px;">Reduce your debts</h4>
      <p>Prioritize paying off high-interest debts. Consider strategies like the <a href="#" style="color: inherit; text-decoration: underline;">avalanche method</a> or the <a href="#" style="color: inherit; text-decoration: underline;">snowball method</a>.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 14px;">
        <tr style="background-color: rgba(230, 255, 230, 0.42);">
          <th style="padding: 8px; text-align: left; border: 1px solid rgba(200, 230, 201, 0.42);">Method</th>
          <th style="padding: 8px; text-align: left; border: 1px solid rgba(200, 230, 201, 0.42);">Advantage</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid rgba(200, 230, 201, 0.42);">Avalanche</td>
          <td style="padding: 8px; border: 1px solid rgba(200, 230, 201, 0.42);">Saves more money on interest in the long run</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid rgba(200, 230, 201, 0.42);">Snowball</td>
          <td style="padding: 8px; border: 1px solid rgba(200, 230, 201, 0.42);">Provides quick wins to maintain motivation</td>
        </tr>
      </table>
    </li>
    
    <li style="margin-bottom: 16px;">
      <h4 style="color: inherit; margin-bottom: 8px;">Automate your savings</h4>
      <p>Set up automatic transfers to your savings accounts on the day you receive your paycheck.</p>
    </li>
    
    <li style="margin-bottom: 16px;">
      <h4 style="color: inherit; margin-bottom: 8px;">Invest for the future</h4>
      <p>Start investing as early as possible, even if it's small amounts. <b>Compound interest</b> is your best ally.</p>
      <div style="background-color: rgba(255, 235, 238, 0.42); padding: 8px; border-radius: 4px; margin-top: 8px; border-left: 4px solid rgba(198, 40, 40, 0.8);">
        <span style="font-weight: bold; color: rgba(198, 40, 40, 0.8);">Important:</span> Always research before investing and consider consulting a financial advisor.
      </div>
    </li>
  </ol>
  
  <div style="margin-top: 24px; padding: 16px; background-color: rgba(230 255 230 / 0.42); border-radius: 8px; text-align: center;">
    <p style="margin: 0; font-weight: bold;">Need personalized help with your finances?</p>
    <p style="margin: 8px 0 0 0;">Schedule a <a href="#" style="color: inherit; text-decoration: underline; font-weight: bold;">free consultation</a> with one of our financial advisors.</p>
  </div>
</div>`
    }
];

// Empty state component with modern design
const EmptyState = ({
    title,
    description,
    actionText,
    onAction,
    icon
}: {
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
    icon: string;
}) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                height: '100%',
                minHeight: 300,
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    mb: 3,
                    color: 'primary.main'
                }}
            >
                <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
                    {icon}
                </span>
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
                {title}
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: actionText ? 3 : 0, maxWidth: 320 }}
            >
                {description}
            </Typography>
            {actionText && onAction && (
                <Button
                    variant="contained"
                    disableElevation
                    onClick={onAction}
                    sx={{ mt: 2, borderRadius: 2, px: 3 }}
                >
                    {actionText}
                </Button>
            )}
        </Paper>
    );
};

interface NotificationsInboxProps {
    onClose: () => void;
    onMarkAllAsRead: () => void;
    unreadCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NotificationsInbox(_props: NotificationsInboxProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    // State variables
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Fetch notifications from the server (simulated with mock data)
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Simulate an API call with a delay
            setTimeout(() => {
                setNotifications(mockNotifications);
                setError(null);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError(t('dashboard.notifications.errors.loadingError'));
            toast.error(t('dashboard.notifications.errors.loadingError'));
            setLoading(false);
        }
    };

    // Mark a notification as read
    const handleMarkAsRead = async (notificationId: string) => {
        try {
            // Simulate the update
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification._id === notificationId
                        ? { ...notification, status: 'read', updatedAt: new Date().toISOString() }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error(t('dashboard.notifications.errors.markAsReadError'));
        }
    };

    // Delete a notification
    const handleDeleteNotification = async (notificationId: string) => {
        try {
            // Simulate the deletion
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification._id !== notificationId)
            );
            toast.success(t('dashboard.notifications.success.deleted'));
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error(t('dashboard.notifications.errors.deleteError'));
        }
    };

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const groups: { [key: string]: Notification[] } = {};

        // Sort all notifications from newest to oldest
        const sortedNotifications = [...notifications].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        sortedNotifications.forEach(notification => {
            const date = new Date(notification.createdAt);
            let groupKey = '';

            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                groupKey = 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                groupKey = 'Yesterday';
            } else {
                // Format as "Month Day" (e.g., "March 5")
                groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }

            groups[groupKey].push(notification);
        });

        return groups;
    }, [notifications]);

    // Render the notifications list
    const renderNotificationsList = () => {
        if (loading) {
            return (
                <Box>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <Paper
                            key={item}
                            elevation={0}
                            sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Top indicator bar */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                                }}
                            />

                            {/* Avatar skeleton */}
                            <Skeleton
                                variant="circular"
                                width={32}
                                height={32}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                                }}
                            />

                            {/* Content */}
                            <Box sx={{ flex: 1, pt: 0.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Skeleton variant="text" width="60%" height={22} />
                                    <Skeleton variant="circular" width={20} height={20} />
                                </Box>
                                <Skeleton variant="text" width="90%" height={16} sx={{ mb: 0.5 }} />
                                <Skeleton variant="text" width="40%" height={16} />
                            </Box>
                        </Paper>
                    ))}
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="error" variant="h6" gutterBottom>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchNotifications}
                        startIcon={<span className="material-symbols-rounded">refresh</span>}
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        {t('dashboard.common.retry')}
                    </Button>
                </Box>
            );
        }

        if (notifications.length === 0) {
            return (
                <EmptyState
                    icon="notifications_off"
                    title={t('dashboard.notifications.empty.title')}
                    description={t('dashboard.notifications.empty.description')}
                />
            );
        }

        return (
            <Box sx={{ pb: 4 }}>
                {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                    <Box key={date} sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 2,
                                py: 2,
                                bgcolor: theme.palette.background.default
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {date}
                            </Typography>
                        </Box>
                        <Box>
                            {dateNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDeleteNotification}
                                />
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
            {/* Notifications content */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: alpha(theme.palette.primary.main, 0.05),
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: alpha(theme.palette.primary.main, 0.2),
                        borderRadius: '4px',
                    },
                }}
            >
                {renderNotificationsList()}
            </Box>
        </Box>
    );
}
