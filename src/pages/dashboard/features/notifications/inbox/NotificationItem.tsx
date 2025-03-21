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
    Dialog,
    DialogContent,
    Button,
    Paper,
    Avatar,
    useTheme,
    alpha,
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

        // If there is a link, we could navigate to it here
        // (future implementation)
    };

    // Close dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
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
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: alpha(theme.palette[getNotificationColor(notification.type)].light, 0.1),
                        boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                        transform: 'translateY(-1px)'
                    },
                    cursor: hasExtraContent ? 'pointer' : 'default',
                    p: 0,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
                onClick={handleNotificationClick}
                disableGutters
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Notification header with colored bar */}
                    <Box
                        sx={{
                            width: '100%',
                            height: '3px',
                            bgcolor: notification.status === 'unread' ? `${getNotificationColor(notification.type)}.main` : 'transparent'
                        }}
                    />

                    <Box sx={{ 
                        p: 2, 
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5
                    }}>
                        {/* Add a small icon */}
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(theme.palette[getNotificationColor(notification.type)].main, 0.15),
                                color: theme.palette[getNotificationColor(notification.type)].main,
                                fontSize: '1rem'
                            }}
                        >
                            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                                {getNotificationIcon(notification.type)}
                            </span>
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: 0.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: notification.status === 'unread' ? 600 : 500,
                                        fontSize: '0.95rem',
                                        color: 'text.primary',
                                        pr: 1,
                                        lineHeight: 1.3
                                    }}
                                    noWrap
                                >
                                    {notification.title}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {notification.status === 'unread' && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: `${getNotificationColor(notification.type)}.main`,
                                                mr: 1
                                            }}
                                        />
                                    )}
                                    <IconButton
                                        edge="end"
                                        onClick={handleOpenMenu}
                                        size="small"
                                        sx={{ 
                                            width: 28,
                                            height: 28,
                                            ml: 0.5, 
                                            mt: -0.5 
                                        }}
                                    >
                                        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>more_vert</span>
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ 
                                    fontSize: '0.825rem', 
                                    lineHeight: 1.4,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                {notification.message}
                            </Typography>

                            {/* Removed date display */}
                        </Box>
                    </Box>
                </Box>
            </ListItem>

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
                    fullScreen={isMobile}
                    slotProps={{
                        paper: {
                            sx: {
                                overflow: 'hidden',
                                borderRadius: isMobile ? 0 : 3,
                                height: isMobile ? '100dvh' : 'auto',
                                m: isMobile ? 0 : 2
                            }
                        }
                    }}
                    TransitionProps={{
                        onEntered: () => {
                            // Scroll al inicio cuando se abre el diálogo
                            if (isMobile) {
                                window.scrollTo(0, 0);
                                document.body.style.overflow = 'hidden';
                            }
                        },
                        onExited: () => {
                            // Restaurar scroll cuando se cierra
                            if (isMobile) {
                                document.body.style.overflow = '';
                            }
                        }
                    }}
                >
                    <Paper
                        sx={{
                            bgcolor: alpha(theme.palette[getNotificationColor(notification.type)].light, 0.3),
                            p: 3,
                            position: 'relative',
                            borderRadius: 3,
                            mx: 1,
                            boxShadow: isMobile ? 'none' : undefined
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
                                <span className="material-symbols-rounded" style={{ fontSize: '2rem' }}>
                                    {getNotificationIcon(notification.type)}
                                </span>
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
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
                            <IconButton
                                edge="end"
                                onClick={handleCloseDialog}
                                sx={{ mt: -1, mr: -1 }}
                            >
                                <span className="material-symbols-rounded">close</span>
                            </IconButton>
                        </Box>
                    </Paper>

                    <DialogContent
                        sx={{
                            p: 3,
                            height: isMobile ? 'calc(100dvh - 150px)' : 'auto',
                            overflow: 'auto'
                        }}
                    >
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
                                    href={String(notification.metadata.link)}
                                >
                                    {t('dashboard.notifications.actions.viewDetails')}
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
} 