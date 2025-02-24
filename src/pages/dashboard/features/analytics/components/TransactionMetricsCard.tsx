import { Box, Paper, Typography, Skeleton, Fade, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

// Types
import type { TransactionMetrics } from '../../../../../types/models/analytics';

interface TransactionMetricsCardProps {
    data: TransactionMetrics | null;
    loading: boolean;
}

type ViewType = 'daily' | 'monthly';

export default function TransactionMetricsCard({ data, loading }: TransactionMetricsCardProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [viewType, setViewType] = useState<ViewType>('monthly');

    // Simulated data for the chart
    const chartData = {
        daily: {
            xAxis: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setHours(0, 0, 0, 0); // Reset the time to 00:00
                date.setDate(date.getDate() - (6 - i));
                return date;
            }),
            data: [120, 145, 178, 134, 187, 155, data?.today || 0]
        },
        monthly: {
            xAxis: Array.from({ length: 12 }, (_, i) => {
                const date = new Date(2024, i, 1);
                date.setHours(0, 0, 0, 0); // Reset the time to 00:00
                return date;
            }),
            data: [3200, 3800, 3500, 4200, 3900, 4500, 4100, 4800, 4300, 4600, 4200, data?.total || 0]
        }
    };

    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: ViewType) => {
        if (newView !== null) {
            setViewType(newView);
        }
    };

    if (loading) {
        return (
            <Fade in timeout={500}>
                <Paper elevation={3} sx={{
                    p: 2,
                    borderRadius: 3,
                    width: '100%',
                    minHeight: 400
                }}>
                    {/* Title */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton variant="text" width={200} height={32} />
                    </Box>

                    {/* Metrics */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2, 
                        mb: 3 
                    }}>
                        {[1, 2, 3].map((i) => (
                            <Box key={i} sx={{
                                flex: '1 1 200px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton variant="text" width={120} height={24} />
                                </Box>
                                <Skeleton 
                                    variant="text" 
                                    width={100} 
                                    height={40}
                                    sx={{ 
                                        transform: 'none',
                                        transformOrigin: '0 0'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* Divider */}
                    <Skeleton 
                        variant="rectangular" 
                        height={1} 
                        sx={{ my: 2 }} 
                    />

                    {/* Toggle Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Skeleton 
                            variant="rectangular" 
                            width={180} 
                            height={32} 
                            sx={{ borderRadius: 1 }}
                        />
                    </Box>

                    {/* Chart */}
                    <Skeleton 
                        variant="rectangular" 
                        height={250}
                        sx={{ 
                            borderRadius: 1,
                            transform: 'none',
                            transformOrigin: '0 0'
                        }}
                    />
                </Paper>
            </Fade>
        );
    }

    const metrics = [
        {
            label: t('dashboard.analytics.metrics.totalTransactions'),
            value: data?.total || 0,
            icon: 'receipt_long'
        },
        {
            label: t('dashboard.analytics.metrics.transactionsToday'),
            value: data?.today || 0,
            icon: 'post_add'
        },
        {
            label: t('dashboard.analytics.metrics.averageTransactionsPerUser'),
            value: data?.averagePerUser || 0,
            icon: 'query_stats',
            isAverage: true
        }
    ];

    return (
        <Fade in timeout={500}>
            <Paper elevation={3} sx={{
                p: 2,
                borderRadius: 3,
                width: '100%'
            }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                    {t('dashboard.analytics.sections.transactions')}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    {metrics.map((metric, index) => (
                        <Box key={index} sx={{
                            flex: '1 1 200px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                                    {metric.icon}
                                </span>
                                <Typography variant="body2" color="text.secondary">
                                    {metric.label}
                                </Typography>
                            </Box>
                            <Typography variant="h4" color="text.primary">
                                {metric.isAverage
                                    ? metric.value.toFixed(1)
                                    : metric.value.toLocaleString()}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <ToggleButtonGroup
                        value={viewType}
                        exclusive
                        onChange={handleViewChange}
                        size="small"
                    >
                        <ToggleButton value="daily">
                            {t('dashboard.common.daily')}
                        </ToggleButton>
                        <ToggleButton value="monthly">
                            {t('dashboard.common.monthly')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ height: 250, width: '100%' }}>
                    <LineChart
                        xAxis={[{
                            data: chartData[viewType].xAxis,
                            scaleType: 'time',
                            valueFormatter: (date: Date) => {
                                if (viewType === 'daily') {
                                    return date.toLocaleDateString(undefined, { weekday: 'short' });
                                }
                                return date.toLocaleDateString(undefined, { month: 'short' });
                            },
                            min: viewType === 'daily' 
                                ? chartData.daily.xAxis[0].getTime()
                                : undefined,
                            max: viewType === 'daily'
                                ? chartData.daily.xAxis[6].getTime()
                                : undefined,
                            tickNumber: viewType === 'daily' ? 7 : 12
                        }]}
                        series={[{
                            data: chartData[viewType].data,
                            area: false,
                            showMark: false,
                            color: theme.palette.primary.main,
                            valueFormatter: (value: number | null) => value ? value.toLocaleString() : '',
                            connectNulls: true
                        }]}
                        height={250}
                        margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                        sx={{
                            '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                                transform: 'rotate(0deg)'
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Fade>
    );
} 