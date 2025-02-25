import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTranslation } from 'react-i18next';

// Types
import type { DeviceMetrics } from '../../../../../types/models/analytics';

interface DeviceMetricsCardProps {
    data: DeviceMetrics | null;
    loading: boolean;
}

export default function DeviceMetricsCard({ data, loading }: DeviceMetricsCardProps) {
    const { t } = useTranslation();

    if (loading) {
        return (
            <Paper elevation={3} sx={{
                p: 2,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Loading Skeleton for Title */}
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={150} height={32} sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                </Box>

                {/* Loading Skeleton for Chart */}
                <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 260
                }}>
                    <Skeleton variant="circular" width={200} height={200} sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                    
                    {/* Loading Skeleton for Legend Items */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        mt: 2,
                        justifyContent: 'center'
                    }}>
                        {[1, 2, 3].map((i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Skeleton variant="rectangular" width={10} height={10} sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} />
                                <Skeleton variant="text" width={60} height={20} sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Paper>
        );
    }

    const deviceData = [
        {
            id: 'desktop',
            value: data?.desktop || 0,
            label: t('dashboard.analytics.metrics.deviceStatsDesktop'),
            color: '#fe6f14'
        },
        {
            id: 'mobile',
            value: data?.mobile || 0,
            label: t('dashboard.analytics.metrics.deviceStatsMobile'),
            color: '#ff9b61'
        },
        {
            id: 'tablet',
            value: data?.tablet || 0,
            label: t('dashboard.analytics.metrics.deviceStatsTablet'),
            color: '#cc5810'
        }
    ];

    return (
        <Box sx={{ height: '100%' }}>
            <Paper elevation={3} sx={{
                p: 2,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                    {t('dashboard.analytics.sections.devices')}
                </Typography>

                <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <PieChart
                        series={[{
                            data: deviceData,
                            innerRadius: 60,
                            paddingAngle: 2,
                            cornerRadius: 4,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            arcLabel: (item) => `${item.value}%`
                        }]}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'bottom', horizontal: 'middle' },
                                padding: 0,
                                itemMarkWidth: 10,
                                itemMarkHeight: 10,
                                markGap: 5,
                                itemGap: 10,
                                labelStyle: {
                                    fontSize: 14
                                }
                            }
                        }}
                        height={250}
                        width={250}
                        margin={{ 
                            top: 10,
                            bottom: 40,
                            left: 0,
                            right: 0 
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
} 