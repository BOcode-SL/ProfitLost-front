import { Box, Paper, Typography, Skeleton, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

// Services
import { analyticsService } from '../../../../../services/analytics.service';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { UserMetrics, UserMetricsHistory } from '../../../../../types/models/analytics';

interface UserMetricsCardProps {
    data: UserMetrics | null;
    loading: boolean;
}

type ViewType = 'daily' | 'monthly';

export default function UserMetricsCard({ data, loading }: UserMetricsCardProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { user } = useUser();
    const userLanguage = user?.preferences?.language || 'enUS';
    const [viewType, setViewType] = useState<ViewType>('monthly');
    const [chartData, setChartData] = useState<UserMetricsHistory[]>([]);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setChartLoading(true);
                const response = await analyticsService.getUserMetricsHistory(viewType);
                if (response.success && response.data) {
                    setChartData(response.data);
                } else {
                    console.error('Error fetching user metrics history: ', response.message);
                }
            } catch (error) {
                console.error('An error occurred while fetching user metrics history: ', error);
            } finally {
                setChartLoading(false);
            }
        };

        fetchChartData();
    }, [viewType]);

    if (loading) {
        return (
            <Paper elevation={3} sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                width: '100%'
            }}>
                {/* Skeleton for Title */}
                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <Skeleton variant="text" width={150} height={32} sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3, md: 4 }
                }}>
                    {/* Skeletons for Active Metrics */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2, md: 3 }
                    }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Box key={`active-${i}`} sx={{
                                flex: {
                                    xs: '1 1 calc(50% - 8px)',
                                    sm: '1 1 calc(33.33% - 16px)',
                                    md: '1 1 200px'
                                },
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

                    {/* Skeleton for Divider */}
                    <Skeleton variant="rectangular" height={1} sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />

                    {/* Skeletons for New Users Metrics */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2, md: 3 }
                    }}>
                        {[1, 2, 3].map((i) => (
                            <Box key={`new-${i}`} sx={{
                                flex: {
                                    xs: '1 1 calc(50% - 8px)',
                                    sm: '1 1 calc(33.33% - 16px)',
                                    md: '1 1 200px'
                                },
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

                    {/* Skeleton for Chart */}
                    <Box>
                        {/* Skeleton for Toggle Buttons */}
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

                        {/* Skeleton for Chart */}
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
                    </Box>
                </Box>
            </Paper>
        );
    }

    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const activeMetrics = [
        {
            label: t('dashboard.analytics.metrics.totalUsers'),
            value: data?.totalUsers || 0,
            icon: 'groups_2',
            hideComparison: true
        },
        {
            label: t('dashboard.analytics.metrics.activeUsersDaily'),
            value: data?.activeUsers.daily || 0,
            comparison: data?.comparison?.activeUsers.daily || 0,
            icon: 'person'
        },
        {
            label: t('dashboard.analytics.metrics.activeUsersMonthly'),
            value: data?.activeUsers.monthly || 0,
            comparison: data?.comparison?.activeUsers.monthly || 0,
            icon: 'group'
        }
    ];

    const newMetrics = [
        {
            label: t('dashboard.analytics.metrics.newUsersDaily'),
            value: data?.newUsers.daily || 0,
            comparison: data?.comparison?.newUsers.daily || 0,
            icon: 'person_add'
        },
        {
            label: t('dashboard.analytics.metrics.newUsersMonthly'),
            value: data?.newUsers.monthly || 0,
            comparison: data?.comparison?.newUsers.monthly || 0,
            icon: 'group_add'
        }
    ];

    const MetricBox = ({ metric }: { metric: typeof activeMetrics[0] }) => {
        const percentageChange = !metric.hideComparison ? calculatePercentageChange(metric.value, metric.comparison || 0) : null;
        const isPositive = percentageChange !== null && percentageChange > 0;

        return (
            <Box sx={{
                flex: {
                    xs: '1 1 calc(50% - 8px)',
                    sm: '1 1 calc(33.33% - 16px)',
                    md: '1 1 200px'
                },
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minWidth: {
                    xs: 'auto',
                    sm: 150,
                    md: 180
                },
                maxWidth: {
                    xs: '100%',
                    sm: 'none',
                    md: 250
                }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    minHeight: 24
                }}>
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
                            }
                        }}
                    >
                        {metric.label}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography 
                        variant="h4" 
                        color="text.primary"
                        sx={{
                            fontSize: {
                                xs: '1.5rem',
                                sm: '1.75rem',
                                md: '2rem'
                            }
                        }}
                    >
                        {metric.value.toLocaleString()}
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
                                    fontSize: '1rem',
                                    color: percentageChange === 0 ? '#4caf50' : isPositive ? '#4caf50' : '#f44336'
                                }}
                            >
                                {percentageChange === 0 ? 'trending_flat' : isPositive ? 'trending_up' : 'trending_down'}
                            </span>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: percentageChange === 0 ? '#4caf50' : isPositive ? '#4caf50' : '#f44336',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {Math.abs(percentageChange).toFixed(1)}%
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    };

    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: ViewType) => {
        if (newView !== null) {
            setViewType(newView);
        }
    };

    // Function to format the X-axis dates of the chart
    const formatXAxisDate = (date: Date): string => {
        if (viewType === 'daily') {
            // For daily view, translate the day of the week
            const day = date.getDate();
            const dayOfWeekIndex = date.getDay();
            
            // Map the day index to the translation key
            const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayKey = dayKeys[dayOfWeekIndex];
            
            // Get the translation of the day from the language files
            const translatedDay = t(`dashboard.common.dayNamesShort.${dayKey}`);
            
            // Format according to the user's current language preferences
            if (userLanguage.startsWith('es')) {
                return `${translatedDay} ${day}`;
            } else {
                return `${day} ${translatedDay}`;
            }
        } else if (viewType === 'monthly') {
            // For monthly view
            const monthIndex = date.getMonth();
            const year = date.getFullYear();
            const shortYear = year.toString().slice(2);
            
            // Map the month index to the translation key
            const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthKey = monthKeys[monthIndex];
            
            // Get the translation of the month from the language files
            const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
            
            return `${translatedMonth} ${shortYear}`;
        }
        
        // Default case to ensure we always return a string
        return date.toLocaleDateString();
    };

    // Ensure that monthly chart data has unique dates
    const getUniqueMonthlyData = () => {
        if (viewType !== 'monthly' || chartData.length === 0) return chartData;
        
        // Create a map to store a unique value per month
        const monthMap = new Map<string, UserMetricsHistory>();
        
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

    return (
        <Paper elevation={3} sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            width: '100%'
        }}>
            <Typography 
                variant="h6" 
                color="primary" 
                gutterBottom 
                sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: {
                        xs: '1.1rem',
                        sm: '1.25rem'
                    }
                }}
            >
                {t('dashboard.analytics.sections.users')}
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 3, md: 4 }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 2, md: 3 },
                    justifyContent: 'flex-start'
                }}>
                    {activeMetrics.map((metric, index) => (
                        <MetricBox key={index} metric={metric} />
                    ))}
                </Box>

                <Divider />

                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 2, md: 3 },
                    justifyContent: 'flex-start'
                }}>
                    {newMetrics.map((metric, index) => (
                        <MetricBox key={index} metric={metric} />
                    ))}
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
                                    data: processedChartData.map(item => {
                                        const value = viewType === 'daily' ? item.dailyActive : item.monthlyActive;
                                        return value !== undefined ? value : 0;
                                    }),
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