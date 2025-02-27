import { Box, Paper, Typography, LinearProgress, Chip, useTheme } from '@mui/material';

import { useUser } from '../../../../../contexts/UserContext';
import type { Goal } from '../../../../../types/models/goal';
import { formatCurrency } from '../../../../../utils/currencyUtils';
import { formatDate } from '../../../../../utils/dateUtils';

interface GoalCardProps {
    goal: Goal;
    onClick: () => void;
}

type GoalStatus = 'in_progress' | 'almost_done' | 'done' | 'overdue';

export default function GoalCard({ goal, onClick }: GoalCardProps) {
    const theme = useTheme();
    const { user } = useUser();

    const calculateProgress = (current: number, target: number): number => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    const calculateGoalStatus = (progress: number, deadline?: string): GoalStatus => {
        if (progress >= 100) return 'done';

        if (deadline) {
            const today = new Date();
            const deadlineDate = new Date(deadline);

            if (today > deadlineDate && progress < 100) {
                return 'overdue';
            }

            const timeLeft = deadlineDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

            if (progress >= 80 || (daysLeft <= 30 && progress >= 60)) {
                return 'almost_done';
            }
        } else {
            if (progress >= 80) {
                return 'almost_done';
            }
        }

        return 'in_progress';
    };

    const getStatusColor = (status: GoalStatus): string => {
        switch (status) {
            case 'done':
                return theme.palette.success.main;
            case 'almost_done':
                return theme.palette.info.main;
            case 'overdue':
                return theme.palette.error.main;
            default:
                return theme.palette.primary.main;
        }
    };

    const getStatusLabel = (status: GoalStatus): string => {
        switch (status) {
            case 'done':
                return 'Completed';
            case 'almost_done':
                return 'Almost Done';
            case 'overdue':
                return 'Overdue';
            default:
                return 'In Progress';
        }
    };

    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const status = calculateGoalStatus(progress, goal.deadline);

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                minWidth: '450px',
                '&:hover': {
                    boxShadow: 3
                }
            }}
            onClick={onClick}
        >
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>{goal.name}</Typography>
                <Typography variant="body2" color="text.secondary">{goal.type}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(goal.currentAmount, user)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        of {formatCurrency(goal.targetAmount, user)}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                            bgcolor: getStatusColor(status)
                        }
                    }}
                />
                <Typography
                    variant="body2"
                    sx={{ mt: 0.5, textAlign: 'right' }}
                >
                    {progress}%
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Chip
                    label={getStatusLabel(status)}
                    size="small"
                    sx={{
                        bgcolor: `${getStatusColor(status)}20`,
                        color: getStatusColor(status),
                        fontWeight: 500
                    }}
                />
                {goal.deadline && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: status === 'overdue' ? 'error.main' : 'text.secondary'
                    }}>
                        <span className="material-symbols-rounded">calendar_month</span>
                        <Typography variant="body2">
                            {formatDate(goal.deadline, user)}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}