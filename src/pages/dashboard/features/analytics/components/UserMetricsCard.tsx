import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Types
import type { UserMetrics } from '../../../../../types/models/analytics';

interface UserMetricsCardProps {
    data: UserMetrics | null;
    loading: boolean;
}

export default function UserMetricsCard({ data, loading }: UserMetricsCardProps) {
    const { t } = useTranslation();

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
                    {/* Skeletons for All User Metrics in a single row */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2, md: 3 }
                    }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Box key={`metric-${i}`} sx={{
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
                </Box>
            </Paper>
        );
    }

    // Combine all metrics into a single array
    const allMetrics = [
        {
            label: t('dashboard.analytics.metrics.totalUsers'),
            value: data?.totalUsers || 0,
            icon: 'groups_2'
        },
        {
            label: t('dashboard.analytics.metrics.activeUsersDaily'),
            value: data?.activeUsers.daily || 0,
            icon: 'person'
        },
        {
            label: t('dashboard.analytics.metrics.activeUsersMonthly'),
            value: data?.activeUsers.monthly || 0,
            icon: 'group'
        },
        {
            label: t('dashboard.analytics.metrics.newUsersDaily'),
            value: data?.newUsers.daily || 0,
            icon: 'person_add'
        },
        {
            label: t('dashboard.analytics.metrics.newUsersMonthly'),
            value: data?.newUsers.monthly || 0,
            icon: 'group_add'
        }
    ];

    const MetricBox = ({ metric }: { metric: typeof allMetrics[0] }) => {
        return (
            <Box sx={{
                flex: 1,
                minWidth: { xs: '45%', sm: 'auto' },
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mb: { xs: 1, sm: 0 }
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
                    <Typography 
                        variant="h4" 
                        color="text.primary"
                        sx={{
                            fontSize: {
                                xs: '1.25rem',
                                sm: '1.5rem',
                                md: '1.75rem'
                            }
                        }}
                    >
                        {metric.value.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        );
    };

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
                {/* All metrics in a single row */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 2, md: 3 },
                    justifyContent: 'space-between'
                }}>
                    {allMetrics.map((metric, index) => (
                        <MetricBox key={index} metric={metric} />
                    ))}
                </Box>
            </Box>
        </Paper>
    );
}