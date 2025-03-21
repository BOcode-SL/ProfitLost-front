import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
    Box, 
    Paper, 
    Typography, 
    FormControlLabel, 
    Switch, 
    Divider, 
    Button, 
    FormGroup,
    CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Services
import notificationService from '../../../../services/notification.service';

// Types
import type { NotificationPreferences as NotificationPreferencesType, NotificationType } from '../../../../types/models/notification';

// Interface for the props of the NotificationPreferences component
interface NotificationPreferencesProps {
    onSuccess?: () => void; // Optional function called on successful save
    source?: 'notifications' | 'settings'; // Identifies where the component was opened from
}

// NotificationPreferences component
export default function NotificationPreferences({ onSuccess, source = 'settings' }: NotificationPreferencesProps) {
    const { t } = useTranslation();
    
    // The source parameter ('notifications' or 'settings') determines 
    // how the back navigation behavior works in the parent component
    
    // Log the source for debugging and to fix linter error
    useEffect(() => {
        console.log(`NotificationPreferences opened from: ${source}`);
    }, [source]);
    
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [preferences, setPreferences] = useState<NotificationPreferencesType>({
        inApp: {
            enabled: true,
            types: {
                payment_reminder: true,
                achievement: true,
                goal_progress: true,
                tip: true,
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
                announcement: true
            }
        }
    });

    // Load preferences when the component mounts
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                setInitialLoading(true);
                const data = await notificationService.getNotificationPreferences();
                setPreferences(data);
            } catch (error) {
                console.error('Error loading notification preferences:', error);
                toast.error(t('dashboard.settings.notifications.errors.loadingError'));
            } finally {
                setInitialLoading(false);
            }
        };

        loadPreferences();
    }, [t]);

    // Handle changes in the main switches
    const handleMainSwitchChange = (type: 'inApp' | 'email') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setPreferences(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                enabled: checked
            }
        }));
    };

    // Handle changes in the notification type switches
    const handleTypeSwitchChange = (mainType: 'inApp' | 'email', notificationType: NotificationType) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setPreferences(prev => ({
            ...prev,
            [mainType]: {
                ...prev[mainType],
                types: {
                    ...prev[mainType].types,
                    [notificationType]: checked
                }
            }
        }));
    };

    // Save the preferences
    const handleSave = async () => {
        try {
            setLoading(true);
            await notificationService.updateNotificationPreferences(preferences);
            toast.success(t('dashboard.settings.notifications.success.saved'));
            // Only call onSuccess if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            toast.error(t('dashboard.settings.notifications.errors.savingError'));
        } finally {
            setLoading(false);
        }
    };

    // Render switches for each notification type
    const renderNotificationTypesSwitches = (mainType: 'inApp' | 'email') => {
        const notificationTypes: NotificationType[] = [
            'payment_reminder',
            'achievement',
            'goal_progress',
            'tip',
            'announcement'
        ];

        return (
            <FormGroup sx={{ ml: 4, mt: 1 }}>
                {notificationTypes.map((type) => (
                    <FormControlLabel
                        key={type}
                        control={
                            <Switch
                                checked={preferences[mainType].types[type]}
                                onChange={handleTypeSwitchChange(mainType, type)}
                                disabled={!preferences[mainType].enabled || loading}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2">
                                    {t(`dashboard.notifications.types.${type}`)}
                                </Typography>
                            </Box>
                        }
                    />
                ))}
            </FormGroup>
        );
    };

    // Display the loading state
    if (initialLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* In-app notifications section */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.notifications.inApp.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('dashboard.settings.notifications.inApp.description')}
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={preferences.inApp.enabled}
                                onChange={handleMainSwitchChange('inApp')}
                                disabled={loading}
                            />
                        }
                        label={
                            <Typography variant="body1" fontWeight={500}>
                                {t('dashboard.settings.notifications.inApp.enable')}
                            </Typography>
                        }
                    />

                    <Divider sx={{ my: 2 }} />

                    {renderNotificationTypesSwitches('inApp')}
                </Paper>

                {/* Email notifications section */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.notifications.email.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('dashboard.settings.notifications.email.description')}
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={preferences.email.enabled}
                                onChange={handleMainSwitchChange('email')}
                                disabled={loading}
                            />
                        }
                        label={
                            <Typography variant="body1" fontWeight={500}>
                                {t('dashboard.settings.notifications.email.enable')}
                            </Typography>
                        }
                    />

                    <Divider sx={{ my: 2 }} />

                    {renderNotificationTypesSwitches('email')}
                </Paper>

                {/* Save button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? t('dashboard.common.saving') : t('dashboard.common.save')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
} 