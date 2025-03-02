import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Components
import UserMetricsCard from './components/UserMetricsCard';
import DeviceMetricsCard from './components/DeviceMetricsCard';
import TransactionMetricsCard from './components/TransactionMetricsCard';

// Services
import { analyticsService } from '../../../../services/analytics.service';

// Utils
import { formatDateTime } from '../../../../utils/dateUtils';

// Types
import type { AnalyticsData } from '../../../../types/models/analytics';
import type { AnalyticsErrorType } from '../../../../types/api/errors';

export default function Analytics() {
    const { t } = useTranslation();
    const { user } = useUser();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [savingMetrics, setSavingMetrics] = useState(false);

    useEffect(() => {
        // Update the date and time every minute
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            if (!user?.role || user.role !== 'admin') return;

            setLoading(true);

            try {
                // Fetch user metrics
                const userMetricsResponse = await analyticsService.getUserMetrics();
                if (!userMetricsResponse.success) {
                    throw new Error(userMetricsResponse.message || t('dashboard.analytics.errors.fetchError'));
                }

                // Fetch transaction metrics
                const transactionMetricsResponse = await analyticsService.getTransactionMetrics();
                if (!transactionMetricsResponse.success) {
                    throw new Error(transactionMetricsResponse.message || t('dashboard.analytics.errors.fetchError'));
                }

                // Combine the data
                setData({
                    users: userMetricsResponse.data!,
                    transactions: transactionMetricsResponse.data!,
                    // This is temporary; it should be obtained from the database
                    devices: {
                        desktop: 60,
                        mobile: 30,
                        tablet: 10
                    }
                });
            } catch (err) {
                const error = err as Error;
                console.error('Error fetching analytics data:', error);

                // Determine the type of error to display a more specific message
                let errorType: AnalyticsErrorType = 'ANALYTICS_PROCESSING_ERROR';
                if (error.message.toLowerCase().includes('connection')) {
                    errorType = 'CONNECTION_ERROR';
                } else if (error.message.toLowerCase().includes('database')) {
                    errorType = 'DATABASE_ERROR';
                }

                // Show error message with toast
                const commonErrorTypes: string[] = ['CONNECTION_ERROR', 'DATABASE_ERROR', 'SERVER_ERROR', 'NETWORK_ERROR', 'FETCH_ERROR', 'UNAUTHORIZED'];
                if (commonErrorTypes.includes(errorType)) {
                    toast.error(t(`dashboard.common.error.${errorType}`));
                } else {
                    toast.error(t(`dashboard.analytics.errors.${errorType.toLowerCase()}`));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [t, user]);

    // Function to manually save metrics
    const handleSaveMetrics = async () => {
        if (savingMetrics) return;

        setSavingMetrics(true);
        try {
            const response = await analyticsService.saveUserMetrics();
            if (response.success) {
                toast.success(t('dashboard.analytics.success.saveSuccess'));
                // Reload the data after saving
                const userMetricsResponse = await analyticsService.getUserMetrics();
                if (userMetricsResponse.success && data) {
                    setData({
                        ...data,
                        users: userMetricsResponse.data!
                    });
                }
            } else {
                // Show a more specific error message based on the error type
                const errorMessage = response.error === 'DATABASE_ERROR'
                    ? t('dashboard.common.error.DATABASE_ERROR')
                    : response.error === 'METRICS_SAVE_ERROR'
                        ? t('dashboard.analytics.errors.metrics_save_error')
                        : response.message;

                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error saving metrics:', error);
            toast.error(t('dashboard.analytics.errors.metrics_save_error'));
        } finally {
            setSavingMetrics(false);
        }
    };

    // Verify if the user has administrator privileges
    if (!user?.role || user.role !== 'admin') {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {t('dashboard.common.error.UNAUTHORIZED')}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Current Date and Time with Save Metrics Button */}
            <Paper elevation={3} sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                        schedule
                    </span>
                    <Typography variant="body1" color="text.secondary">
                        {formatDateTime(currentDateTime.toISOString(), user)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSaveMetrics}
                    disabled={savingMetrics}
                    startIcon={
                        savingMetrics ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                                save
                            </span>
                        )
                    }
                >
                    {savingMetrics
                        ? t('dashboard.common.saving')
                        : t('dashboard.analytics.saveMetrics')}
                </Button>
            </Paper>

            {/* Card displaying user metrics */}
            <Box sx={{ width: '100%' }}>
                <UserMetricsCard data={data?.users || null} loading={loading} />
            </Box>

            {/* Card displaying transaction metrics */}
            <Box sx={{ width: '100%' }}>
                <TransactionMetricsCard data={data?.transactions || null} loading={loading} />
            </Box>

            {/* Cards for Device (1/3) and Engagement (2/3) metrics */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                minHeight: { xs: 'auto', md: 320 }
            }}>
                <Box sx={{
                    flex: { xs: '1', md: '1' },
                    minWidth: { xs: '100%', md: '300px' },
                }}>
                    <DeviceMetricsCard data={data?.devices || null} loading={loading} />
                </Box>
                <Box sx={{
                    flex: { xs: '1', md: '2' },
                    minWidth: { xs: '100%', md: '400px' }
                }}>
                </Box>
            </Box>
        </Box>
    );
} 