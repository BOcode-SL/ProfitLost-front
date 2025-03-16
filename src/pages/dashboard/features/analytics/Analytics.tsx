import { useState, useEffect } from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Components
import UserMetricsCard from './components/UserMetricsCard';
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
    const theme = useTheme();
    
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            {/* Current Date and Time */}
            <Paper elevation={3} sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                width: '100%',
                display: 'flex',
                flexDirection: { xs: isXsScreen ? 'column' : 'row', sm: 'row' },
                alignItems: { xs: isXsScreen ? 'flex-start' : 'center', sm: 'center' },
                gap: { xs: 1, sm: 0 },
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                        schedule
                    </span>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        {formatDateTime(currentDateTime, user)}
                    </Typography>
                </Box>
            </Paper>

            {/* Analytics Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {/* User Metrics Card */}
                <UserMetricsCard data={data?.users || null} loading={loading} />

                {/* Transaction Metrics Card */}
                <TransactionMetricsCard data={data?.transactions || null} loading={loading} />
            </Box>
        </Box>
    );
} 