import { Box, Paper, Typography, Skeleton, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

// Services
import { analyticsService } from '../../../../../services/analytics.service';

// Types
import type { TransactionMetrics, TransactionHistory } from '../../../../../types/models/analytics';

interface TransactionMetricsCardProps {
    data: TransactionMetrics | null;
    loading: boolean;
}

type ViewType = 'daily' | 'monthly';

export default function TransactionMetricsCard({ data, loading }: TransactionMetricsCardProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [viewType, setViewType] = useState<ViewType>('monthly');
    const [chartData, setChartData] = useState<TransactionHistory[]>([]);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setChartLoading(true);
                const response = await analyticsService.getTransactionHistory(viewType);
                if (response.success && response.data) {
                    setChartData(response.data);
                }
            } catch (error) {
                console.error('Error fetching transaction history:', error);
            } finally {
                setChartLoading(false);
            }
        };

        fetchChartData();
    }, [viewType]);

    // Ensure that monthly chart data has unique dates
    const getUniqueMonthlyData = () => {
        if (viewType !== 'monthly' || chartData.length === 0) return chartData;
        
        // Create a map to store a unique value per month
        const monthMap = new Map<string, TransactionHistory>();
        
        chartData.forEach(item => {
            const date = new Date(item.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            
            // Only save the first value for each month
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, item);
            }
        });
        
        // Convert the map back to an array and sort it by date
        return Array.from(monthMap.values())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // Get the processed data for the chart
    const processedChartData = viewType === 'monthly' ? getUniqueMonthlyData() : chartData;

    if (loading) {
        return (
            <Paper elevation={3} sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                width: '100%'
            }}>
                {/* Title */}
                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <Skeleton variant="text" width={200} height={32} sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                </Box>

                {/* Metrics in a single row */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 2, md: 3 }
                }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Box key={i} sx={{
                            flex: 1,
                            minWidth: { xs: '45%', sm: 'auto' },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Skeleton variant="circular" width={20} height={20} sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} />
                                <Skeleton variant="text" width={100} height={24} sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} />
                            </Box>
                            <Skeleton
                                variant="text"
                                width={80}
                                height={40}
                                sx={{
                                    transform: 'none',
                                    transformOrigin: '0 0',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Divider */}
                <Divider sx={{
                    my: 2,
                    animation: 'pulse 1.5s ease-in-out infinite'
                }} />

                {/* Toggle Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Skeleton
                        variant="rectangular"
                        width={180}
                        height={32}
                        sx={{
                            borderRadius: 1,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </Box>

                {/* Chart */}
                <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{
                        borderRadius: 1,
                        transform: 'none',
                        transformOrigin: '0 0',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
            </Paper>
        );
    }

    const metrics = [
        {
            label: t('dashboard.analytics.metrics.totalTransactions'),
            value: data?.total || 0,
            icon: 'receipt_long',
            hideComparison: true
        },
        {
            label: t('dashboard.analytics.metrics.transactionsToday'),
            value: data?.today || 0,
            comparison: data?.comparison.today || 0,
            icon: 'post_add'
        },
        {
            label: t('dashboard.analytics.metrics.transactionsThisMonth'),
            value: data?.thisMonth || 0,
            comparison: data?.comparison.thisMonth || 0,
            icon: 'calendar_month'
        },
        {
            label: t('dashboard.analytics.metrics.averageTransactionsPerUser'),
            value: data?.averagePerUser || 0,
            comparison: data?.comparison.averagePerUser || 0,
            icon: 'query_stats',
            isAverage: true,
            hideComparison: true
        }
    ];

    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: ViewType) => {
        if (newView !== null) {
            setViewType(newView);
        }
    };

    // Function to format the X-axis dates of the chart
    const formatXAxisDate = (date: Date): string => {
        if (viewType === 'daily') {
            // For daily view, we need to translate the day of the week
            const day = date.getDate();
            const dayOfWeekIndex = date.getDay();
            
            // Map the day index to the translation key
            const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayKey = dayKeys[dayOfWeekIndex];
            
            // Get the translation of the day from the language files
            const translatedDay = t(`dashboard.common.dayNamesShort.${dayKey}`);
            
            // Different format based on the language:
            const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
            
            if (currentLanguage.startsWith('es')) {
                return `${translatedDay} ${day}`;
            } else {
                return `${day} ${translatedDay}`;
            }
        }
        
        const monthIndex = date.getMonth();
        const monthKey = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
        
        const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
        const year = date.getFullYear().toString().slice(2);
        
        return `${translatedMonth} ${year}`;
    };

    return (
        <Paper elevation={3} sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            width: '100%'
        }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: { xs: 1.5, sm: 2 } }}>
                {t('dashboard.analytics.sections.transactions')}
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 3, md: 4 }
            }}>
                {/* All metrics in a single row */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 2, md: 3 },
                    justifyContent: 'space-between'
                }}>
                    {metrics.map((metric, index) => {
                        const percentageChange = !metric.hideComparison ? calculatePercentageChange(metric.value, metric.comparison || 0) : null;
                        const isPositive = percentageChange !== null && percentageChange > 0;

                        return (
                            <Box key={index} sx={{
                                flex: 1,
                                minWidth: { xs: '45%', sm: 'auto' },
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                mb: { xs: 1, sm: 0 }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 24 }}>
                                    <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                                        {metric.icon}
                                    </span>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem'
                                            },
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {metric.label}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography variant="h4" color="text.primary" sx={{
                                        fontSize: {
                                            xs: '1.25rem',
                                            sm: '1.5rem',
                                            md: '1.75rem'
                                        }
                                    }}>
                                        {metric.isAverage
                                            ? metric.value.toFixed(1)
                                            : metric.value.toLocaleString()}
                                    </Typography>
                                    {!metric.hideComparison && percentageChange !== null && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}>
                                            <span
                                                className="material-symbols-rounded"
                                                style={{
                                                    fontSize: '0.875rem',
                                                    color: percentageChange === 0 ? '#4caf50' : isPositive ? '#4caf50' : '#f44336'
                                                }}
                                            >
                                                {percentageChange === 0 ? 'trending_flat' : isPositive ? 'trending_up' : 'trending_down'}
                                            </span>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: percentageChange === 0 ? '#4caf50' : isPositive ? '#4caf50' : '#f44336',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {Math.abs(percentageChange).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                <Divider />

                {/* Chart Section */}
                <Box>
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

                    <Box sx={{
                        height: { xs: 200, sm: 250 },
                        width: '100%',
                        mt: { xs: 1, sm: 2 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {chartLoading ? (
                            <Skeleton
                                variant="rectangular"
                                height="100%"
                                width="100%"
                                sx={{
                                    borderRadius: 1,
                                    transform: 'none',
                                    transformOrigin: '0 0',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}
                            />
                        ) : processedChartData.length > 0 ? (
                            <LineChart
                                xAxis={[{
                                    data: processedChartData.map(item => new Date(item.date)),
                                    scaleType: 'time',
                                    valueFormatter: formatXAxisDate,
                                    min: processedChartData.length > 0 ? new Date(processedChartData[0].date) : undefined,
                                    max: processedChartData.length > 0 ? new Date(processedChartData[processedChartData.length - 1].date) : undefined,
                                    tickNumber: viewType === 'monthly' ? Math.min(12, processedChartData.length) : processedChartData.length
                                }]}
                                series={[{
                                    data: processedChartData.map(item => item.count),
                                    area: false,
                                    showMark: false,
                                    color: theme.palette.primary.main,
                                    valueFormatter: (value: number | null) => value ? value.toLocaleString() : '',
                                    connectNulls: true
                                }]}
                                height={undefined}
                                margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        transform: 'rotate(0deg)'
                                    }
                                }}
                                disableAxisListener
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {t('dashboard.analytics.metrics.noData')}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
} 