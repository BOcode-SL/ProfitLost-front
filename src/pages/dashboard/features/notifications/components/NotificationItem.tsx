import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Typography,
    Box,
    Chip,
    Menu,
    MenuItem,
    Divider,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Paper,
    Avatar,
    useTheme,
    alpha
} from '@mui/material';

// Date utilities
import { formatDateTime } from '../../../../../utils/dateUtils';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import { Notification, NotificationType } from '../../../../../types/models/notification';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const open = Boolean(anchorEl);

    // Determine if the notification has extra content
    const hasExtraContent = Boolean(notification.content);

    // Open options menu
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    // Close options menu
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Mark notification as read
    const handleMarkAsRead = () => {
        onMarkAsRead(notification._id);
        handleCloseMenu();
    };

    // Delete notification
    const handleDelete = () => {
        onDelete(notification._id);
        handleCloseMenu();
    };

    // Handle click on the notification
    const handleNotificationClick = () => {
        // Only open the dialog if there is extra content
        if (hasExtraContent) {
            setDialogOpen(true);

            // If the notification is unread, mark it as read when opening the dialog
            if (notification.status === 'unread') {
                onMarkAsRead(notification._id);
            }
        } else if (notification.status === 'unread') {
            // If there is no extra content but it is unread, mark it as read
            onMarkAsRead(notification._id);
        }

        // If there is a link, we could navigate to it here
        // (future implementation)
    };

    // Close dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Get emoji based on notification type
    const getNotificationEmoji = (type: NotificationType): string => {
        switch (type) {
            case 'payment_reminder':
                return '💰';
            case 'achievement':
                return '🏆';
            case 'goal_progress':
                return '🎯';
            case 'tip':
                return '💡';
            case 'system':
                return 'ℹ️';
            case 'announcement':
                return '📢';
            default:
                return '📩';
        }
    };

    // Get color based on notification type
    const getNotificationColor = (type: NotificationType): 'error' | 'success' | 'info' | 'warning' | 'primary' | 'secondary' => {
        switch (type) {
            case 'payment_reminder':
                return 'error';
            case 'achievement':
                return 'success';
            case 'goal_progress':
                return 'info';
            case 'tip':
                return 'warning';
            case 'system':
                return 'secondary';
            case 'announcement':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    // Format date according to user preferences
    const formatDate = (dateString: string) => {
        // If the user is not available, use a default format
        if (!user) {
            const date = new Date(dateString);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
        return formatDateTime(dateString, user);
    };

    // Function to safely render HTML content
    const renderHtmlContent = (htmlContent: string) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
        <>
            <ListItem
                alignItems="flex-start"
                sx={{
                    bgcolor: notification.status === 'unread' ? 'action.hover' : 'transparent',
                    borderRadius: 1,
                    mb: 1,
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                        bgcolor: 'action.selected',
                    },
                    cursor: hasExtraContent ? 'pointer' : 'default'
                }}
                secondaryAction={
                    <IconButton edge="end" onClick={handleOpenMenu}>
                        <span className="material-symbols-rounded">more_vert</span>
                    </IconButton>
                }
                onClick={handleNotificationClick}
            >
                <ListItemIcon>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: `${getNotificationColor(notification.type)}.light`,
                            color: `${getNotificationColor(notification.type)}.main`,
                            fontSize: '1.5rem'
                        }}
                    >
                        {getNotificationEmoji(notification.type)}
                    </Box>
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: notification.status === 'unread' ? 600 : 400,
                                }}
                            >
                                {notification.title}
                            </Typography>
                            {notification.status === 'unread' && (
                                <Chip
                                    label={t('dashboard.notifications.unread')}
                                    size="small"
                                    color="primary"
                                    sx={{ height: 20 }}
                                />
                            )}
                        </Box>
                    }
                    secondary={
                        <>
                            <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ mb: 1, display: 'block' }}
                            >
                                {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={t(`dashboard.notifications.types.${notification.type}`)}
                                    size="small"
                                    color={getNotificationColor(notification.type)}
                                    sx={{ height: 20 }}
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {formatDate(notification.createdAt)}
                                </Typography>
                            </Box>
                        </>
                    }
                />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Options menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {notification.status === 'unread' && (
                    <MenuItem onClick={handleMarkAsRead}>
                        <ListItemIcon>
                            <span className="material-symbols-rounded">mark_email_read</span>
                        </ListItemIcon>
                        <ListItemText>
                            {t('dashboard.notifications.actions.markAsRead')}
                        </ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <span className="material-symbols-rounded">delete</span>
                    </ListItemIcon>
                    <ListItemText>
                        {t('dashboard.notifications.actions.delete')}
                    </ListItemText>
                </MenuItem>
            </Menu>

            {/* Dialog for full content - only shown if there is extra content */}
            {hasExtraContent && (
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            overflow: 'hidden',
                            borderRadius: 3
                        }
                    }}
                >
                    <Paper
                        sx={{
                            bgcolor: alpha(theme.palette[getNotificationColor(notification.type)].light, 0.3),
                            p: 3,
                            position: 'relative',
                            borderRadius: 3,
                            mx: 1
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette[getNotificationColor(notification.type)].main,
                                    color: theme.palette[getNotificationColor(notification.type)].contrastText,
                                    width: 56,
                                    height: 56,
                                    fontSize: '2rem'
                                }}
                            >
                                {getNotificationEmoji(notification.type)}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {notification.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Chip
                                        label={t(`dashboard.notifications.types.${notification.type}`)}
                                        size="small"
                                        color={getNotificationColor(notification.type)}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(notification.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <DialogContent sx={{ p: 3 }}>
                        <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                            {notification.message}
                        </Typography>

                        <Box 
                            sx={{
                                lineHeight: 1.6,
                                '& p': { mb: 1.5 },
                                '& b, & strong': { fontWeight: 600 },
                                '& ul, & ol': { pl: 2, mb: 1.5 },
                                '& li': { mb: 0.5 },
                                '& h3, & h4': { mt: 2, mb: 1, fontWeight: 600 },
                                '& a': { 
                                    color: theme.palette[getNotificationColor(notification.type)].main,
                                    textDecoration: 'underline',
                                    '&:hover': {
                                        textDecoration: 'none'
                                    }
                                },
                                '& table': {
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    mb: 2
                                },
                                '& th, & td': {
                                    border: `1px solid ${theme.palette.divider}`,
                                    p: 1
                                },
                                '& th': {
                                    bgcolor: alpha(theme.palette[getNotificationColor(notification.type)].light, 0.3),
                                    fontWeight: 600
                                },
                                '& blockquote': {
                                    borderLeft: `4px solid ${theme.palette.divider}`,
                                    pl: 2,
                                    py: 1,
                                    my: 2,
                                    fontStyle: 'italic'
                                },
                                '& img': {
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: 1
                                },
                                '& code': {
                                    fontFamily: 'monospace',
                                    bgcolor: theme.palette.action.hover,
                                    p: 0.5,
                                    borderRadius: 0.5
                                }
                            }}
                        >
                            {notification.content && renderHtmlContent(notification.content)}
                        </Box>

                        {notification.metadata?.link && (
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    color={getNotificationColor(notification.type) === 'secondary' ? 'primary' : getNotificationColor(notification.type)}
                                    startIcon={<span className="material-symbols-rounded">open_in_new</span>}
                                    href={notification.metadata.link as string}
                                >
                                    {t('dashboard.notifications.actions.viewDetails')}
                                </Button>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={handleCloseDialog}>
                            {t('dashboard.common.close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
} 