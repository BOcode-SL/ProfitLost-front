import { Box, Paper, Typography, Skeleton, Fade, Divider } from '@mui/material';
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
            <Fade in timeout={500}>
                <Paper elevation={3} sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    width: '100%'
                }}>
                    {/* Title Skeleton */}
                    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                        <Skeleton variant="text" width={150} height={32} />
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
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width={100} height={24} />
                                    </Box>
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
                            ))}
                        </Box>

                        {/* Skeleton for Divider */}
                        <Skeleton variant="rectangular" height={1} />

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
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width={100} height={24} />
                                    </Box>
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
                            ))}
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        );
    }

    const activeMetrics = [
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
            label: t('dashboard.analytics.metrics.activeUsersWeekly'),
            value: data?.activeUsers.weekly || 0,
            icon: 'group'
        },
        {
            label: t('dashboard.analytics.metrics.activeUsersMonthly'),
            value: data?.activeUsers.monthly || 0,
            icon: 'group'
        }
    ];

    const newMetrics = [
        {
            label: t('dashboard.analytics.metrics.newUsersDaily'),
            value: data?.newUsers.daily || 0,
            icon: 'person_add'
        },
        {
            label: t('dashboard.analytics.metrics.newUsersWeekly'),
            value: data?.newUsers.weekly || 0,
            icon: 'group_add'
        },
        {
            label: t('dashboard.analytics.metrics.newUsersMonthly'),
            value: data?.newUsers.monthly || 0,
            icon: 'group_add'
        }
    ];

    const MetricBox = ({ metric }: { metric: typeof activeMetrics[0] }) => (
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
        </Box>
    );

    return (
        <Fade in timeout={500}>
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
                </Box>
            </Paper>
        </Fade>
    );
} 