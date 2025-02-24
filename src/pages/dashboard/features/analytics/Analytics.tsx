import { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Components
import UserMetricsCard from './components/UserMetricsCard';
import DeviceMetricsCard from './components/DeviceMetricsCard';
import TransactionMetricsCard from './components/TransactionMetricsCard';
import EngagementMetricsCard from './components/EngagementMetricsCard';

// Mock Data
import { mockAnalyticsData } from './components/dataAnalytics';

// Types
import type { AnalyticsData } from '../../../../types/models/analytics';

export default function Analytics() {
    const { t } = useTranslation();
    const { user } = useUser();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating the process of data loading
        const fetchData = async () => {
            setLoading(true);
            try {
                // Placeholder for the actual API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setData(mockAnalyticsData);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        <Fade in timeout={400}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        mb: { xs: 2, md: 0 }
                    }}>
                        <DeviceMetricsCard data={data?.devices || null} loading={loading} />
                    </Box>
                    <Box sx={{
                        flex: { xs: '1', md: '2' },
                        minWidth: { xs: '100%', md: '400px' }
                    }}>
                        <EngagementMetricsCard data={data?.engagement || null} loading={loading} />
                    </Box>
                </Box>
            </Box>
        </Fade>
    );
} 