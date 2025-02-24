import { Box, Paper, Typography, Skeleton, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

// Types
import type { EngagementMetrics } from '../../../../../types/models/analytics';

interface EngagementMetricsCardProps {
    data: EngagementMetrics | null;
    loading: boolean;
}

// Skeleton component for displaying loading state of metrics
const MetricSkeleton = () => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%'
    }}>
        {/* Label with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={180} height={24} />
        </Box>
        
        {/* Progress bar skeleton */}
        <Skeleton 
            variant="rectangular" 
            height={8} 
            sx={{ 
                borderRadius: 1,
                transform: 'none'
            }} 
        />
        
        {/* Value skeleton */}
        <Skeleton 
            variant="text" 
            width={80} 
            height={40}
            sx={{ 
                transform: 'none',
                transformOrigin: '0 0'
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
                    {/* Title */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton variant="text" width={200} height={32} />
                    </Box>

                    {/* Metrics section */}
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

    // Function to determine the color of the progress bar based on value
    const getProgressColor = (value: number) => {
        if (value >= 75) return theme.palette.success.main;
        if (value >= 50) return theme.palette.warning.main;
        return theme.palette.error.main;
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
                    gap: 3,
                    py: 2
                }}>
                    {metrics.map((metric, index) => (
                        <Box key={index} sx={{
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
                            <Typography variant="h5" color="text.primary">
                                {metric.value.toFixed(1)}{metric.suffix}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
} 