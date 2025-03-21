import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Typography,
    Box,
    Menu,
    MenuItem,
    Dialog,
    DialogContent,
    Button,
    Paper,
    Avatar,
    useTheme,
    alpha,
    IconButton,
    Divider,
    Chip,
    Tooltip,
    useMediaQuery
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            case 'announcement':
                return '📢';
            default:
                return '📩';
        }
    };

    // Get color based on notification type
    const getNotificationColor = (type: NotificationType): string => {
        switch (type) {
            case 'payment_reminder':
                return theme.palette.error.main;
            case 'achievement':
                return theme.palette.success.main;
            case 'goal_progress':
                return theme.palette.info.main;
            case 'tip':
                return theme.palette.warning.main;
            case 'announcement':
                return theme.palette.primary.main;
            default:
                return theme.palette.secondary.main;
        }
    };

    // Get icon based on notification type
    const getNotificationIcon = (type: NotificationType): string => {
        switch (type) {
            case 'payment_reminder':
                return 'payments';
            case 'achievement':
                return 'emoji_events';
            case 'goal_progress':
                return 'flag';
            case 'tip':
                return 'tips_and_updates';
            case 'announcement':
                return 'campaign';
            default:
                return 'notifications';
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

    const notificationColor = getNotificationColor(notification.type);
    const notificationIcon = getNotificationIcon(notification.type);

    return (
        <>
            <Paper
                elevation={0}
                onClick={handleNotificationClick}
                sx={{
                    position: 'relative',
                    display: 'flex',
                    mb: 2,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    cursor: hasExtraContent ? 'pointer' : 'default',
                    bgcolor: notification.status === 'unread' 
                        ? alpha(notificationColor, 0.05)
                        : 'background.paper',
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                        bgcolor: notification.status === 'unread' 
                            ? alpha(notificationColor, 0.08)
                            : alpha(theme.palette.primary.main, 0.03)
                    }
                }}
            >
                {/* Status indicator */}
                {notification.status === 'unread' && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            bgcolor: notificationColor
                        }}
                    />
                )}

                {/* Icon container */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        pl: notification.status === 'unread' ? 3 : 2
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: alpha(notificationColor, 0.12),
                            color: notificationColor
                        }}
                    >
                        <span className="material-symbols-rounded">{notificationIcon}</span>
                    </Avatar>
                </Box>

                {/* Content */}
                <Box sx={{ py: 2, pr: 2, flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: notification.status === 'unread' ? 600 : 500,
                                color: 'text.primary',
                                mb: 0.5,
                                pr: 1
                            }}
                            noWrap
                        >
                            {notification.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {hasExtraContent && (
                                <Tooltip title={t('dashboard.notifications.hasDetails')}>
                                    <Box
                                        component="span"
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: notificationColor,
                                            display: 'inline-block',
                                            mr: 1
                                        }}
                                    />
                                </Tooltip>
                            )}
                            <IconButton
                                size="small"
                                onClick={handleOpenMenu}
                                sx={{ 
                                    width: 28, 
                                    height: 28,
                                    color: 'text.secondary',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                                    }
                                }}
                            >
                                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>more_horiz</span>
                            </IconButton>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {notification.message}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.75rem'
                            }}
                        >
                            <span className="material-symbols-rounded" style={{ fontSize: 14, marginRight: 4 }}>
                                schedule
                            </span>
                            {formatDate(notification.createdAt)}
                        </Typography>
                        
                        <Chip
                            label={notification.type.replace('_', ' ')}
                            size="small"
                            sx={{
                                ml: 1.5,
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 500,
                                bgcolor: alpha(notificationColor, 0.1),
                                color: notificationColor,
                                textTransform: 'capitalize'
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Options menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: 180,
                        borderRadius: 2,
                        mt: 0.5
                    }
                }}
            >
                {notification.status === 'unread' && (
                    <MenuItem onClick={handleMarkAsRead} dense>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <span className="material-symbols-rounded" style={{ fontSize: 18, marginRight: 8 }}>
                                mark_email_read
                            </span>
                            {t('dashboard.notifications.actions.markAsRead')}
                        </Box>
                    </MenuItem>
                )}
                {hasExtraContent && (
                    <MenuItem onClick={() => { setDialogOpen(true); handleCloseMenu(); }} dense>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <span className="material-symbols-rounded" style={{ fontSize: 18, marginRight: 8 }}>
                                open_in_full
                            </span>
                            {t('dashboard.notifications.actions.viewDetails')}
                        </Box>
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete} dense>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
                        <span className="material-symbols-rounded" style={{ fontSize: 18, marginRight: 8 }}>
                            delete
                        </span>
                        {t('dashboard.notifications.actions.delete')}
                    </Box>
                </MenuItem>
            </Menu>

            {/* Dialog for detailed content */}
            {hasExtraContent && (
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    fullScreen={isMobile}
                    PaperProps={{
                        elevation: 5,
                        sx: {
                            borderRadius: isMobile ? 0 : 3,
                            bgcolor: 'background.paper'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 1.5,
                                    bgcolor: alpha(notificationColor, 0.1),
                                    color: notificationColor
                                }}
                            >
                                <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                                    {notificationIcon}
                                </span>
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {notification.title}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} edge="end">
                            <span className="material-symbols-rounded">close</span>
                        </IconButton>
                    </Box>
                    
                    <DialogContent sx={{ p: 3, pt: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                {notification.message}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            {notification.content && (
                                <Box sx={{ 
                                    '& a': { color: 'primary.main' },
                                    '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1 }
                                }}>
                                    {renderHtmlContent(notification.content)}
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(notification.createdAt)}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                startIcon={<span className="material-symbols-rounded">delete</span>}
                                onClick={() => {
                                    handleDelete();
                                    handleCloseDialog();
                                }}
                                sx={{ borderRadius: 2 }}
                            >
                                {t('dashboard.notifications.actions.delete')}
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
} 