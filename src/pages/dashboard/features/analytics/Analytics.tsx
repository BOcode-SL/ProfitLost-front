import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
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

export default function Analytics() {
    const { t } = useTranslation();
    const { user } = useUser();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Actualizar la fecha y hora cada minuto
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
                    // esto es temporal, se debe obtener de la base de datos
                    devices: {
                        desktop: 60,
                        mobile: 30,
                        tablet: 10
                    }
                });
            } catch (err) {
                const error = err as Error;
                console.error('Error fetching analytics data:', error);
                toast.error(error.message);
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
                    {t('common.errors.unauthorized')}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Current Date and Time */}
            <Paper elevation={3} sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                    schedule
                </span>
                <Typography variant="body1" color="text.secondary">
                    {formatDateTime(currentDateTime.toISOString(), user)}
                </Typography>
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