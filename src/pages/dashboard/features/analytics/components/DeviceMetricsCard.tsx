import { Box, Paper, Typography, Skeleton, Fade } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

// Types
import type { DeviceMetrics } from '../../../../../types/models/analytics';

interface DeviceMetricsCardProps {
    data: DeviceMetrics | null;
    loading: boolean;
}

export default function DeviceMetricsCard({ data, loading }: DeviceMetricsCardProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    if (loading) {
        return (
            <Fade in timeout={500}>
                <Paper elevation={3} sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Skeleton for Title */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton variant="text" width={150} height={32} />
                    </Box>

                    {/* Skeleton for Chart */}
                    <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 260
                    }}>
                        <Skeleton variant="circular" width={200} height={200} />
                        
                        {/* Skeleton for Legend */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            mt: 2,
                            justifyContent: 'center'
                        }}>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="rectangular" width={10} height={10} />
                                    <Skeleton variant="text" width={60} height={20} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        );
    }

    const deviceData = [
        {
            id: 'desktop',
            value: data?.desktop || 0,
            label: t('dashboard.analytics.metrics.deviceStatsDesktop'),
            color: theme.palette.primary.main
        },
        {
            id: 'mobile',
            value: data?.mobile || 0,
            label: t('dashboard.analytics.metrics.deviceStatsMobile'),
            color: theme.palette.secondary.main
        },
        {
            id: 'tablet',
            value: data?.tablet || 0,
            label: t('dashboard.analytics.metrics.deviceStatsTablet'),
            color: theme.palette.info.main
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
                                    fontSize: 12
                                }
                            }
                        }}
                        height={250}
                        width={250}
                        margin={{ 
                            top: 10,
                            bottom: 40, // Increased to provide space for the legend
                            left: 0,
                            right: 0 
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
} 