import { Box, Paper, Typography, Skeleton, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

// Types
import type { EngagementMetrics } from '../../../../../types/models/analytics';

interface EngagementMetricsCardProps {
    data: EngagementMetrics | null;
    loading: boolean;
}

// Skeleton component for displaying the loading state of metrics
const MetricSkeleton = () => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%'
    }}>
        {/* Label with icon for the metric */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={20} height={20} sx={{
                animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <Skeleton variant="text" width={180} height={24} sx={{
                animation: 'pulse 1.5s ease-in-out infinite'
            }} />
        </Box>

        {/* Skeleton for the progress bar */}
        <Skeleton
            variant="rectangular"
            height={8}
            sx={{
                borderRadius: 1,
                transform: 'none',
                animation: 'pulse 1.5s ease-in-out infinite'
            }}
        />

        {/* Skeleton for the value display */}
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
);

export default function EngagementMetricsCard({ data, loading }: EngagementMetricsCardProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    if (loading) {
        return (
            <Box sx={{ height: '100%' }}>
                <Paper elevation={3} sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Title placeholder while loading */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton variant="text" width={200} height={32} sx={{
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }} />
                    </Box>

                    {/* Section for displaying metrics */}
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        gap: 3,
                        py: 2
                    }}>
                        <MetricSkeleton />
                        <MetricSkeleton />
                    </Box>
                </Paper>
            </Box>
        );
    }

    const metrics = [
        {
            label: t('dashboard.analytics.metrics.userRetention'),
            value: data?.userRetention || 0,
            icon: 'people_outline',
            suffix: '%'
        },
        {
            label: t('dashboard.analytics.metrics.averageSessionDuration'),
            value: data?.averageSessionDuration || 0,
            icon: 'timer',
            suffix: 'min'
        }
    ];

    // Function to determine the color of the progress bar based on the value
    const getProgressColor = (value: number) => {
        if (value >= 75) return '#fe6f14';
        if (value >= 50) return '#ff9b61';
        return '#cc5810';
    };

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
                    {t('dashboard.analytics.sections.engagement')}
                </Typography>

                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    gap: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 2 }
                }}>
                    {metrics.map((metric, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 0.5, sm: 1 }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                                    {metric.icon}
                                </span>
                                <Typography variant="body2" color="text.secondary">
                                    {metric.label}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={metric.suffix === '%' ? metric.value : (metric.value / 15) * 100}
                                sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    bgcolor: theme.palette.action.hover,
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: getProgressColor(metric.suffix === '%' ? metric.value : (metric.value / 15) * 100)
                                    }
                                }}
                            />
                            <Typography variant="h5" color="text.primary" sx={{
                                fontSize: {
                                    xs: '1.5rem',
                                    sm: '1.75rem',
                                    md: '2rem'
                                }
                            }}>
                                {metric.value.toFixed(1)}{metric.suffix}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
} 