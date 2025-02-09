import { useMemo } from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Utils
import { formatCurrency } from '../../../../../utils/formatCurrency';

// Interface for the props of the HomeBalances component
interface HomeBalancesProps {
    type: 'income' | 'expenses' | 'savings'; // Type of balance (income, expenses, or savings)
    transactions: Transaction[]; // Array of transactions
    isLoading: boolean; // Loading state
}

// BalanceCard component
const BalanceCard = ({ type, amount, percentage }: { type: string; amount: number; percentage: number }) => {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();

    const isPositiveTrend = type === 'Spendings'
        ? percentage <= 0
        : percentage >= 0;

    const trendIcon = type === 'Spendings'
        ? percentage === 0 ? 'trending_flat'
            : isPositiveTrend ? 'trending_down'
                : 'trending_up'
        : percentage === 0 ? 'trending_flat'
            : isPositiveTrend ? 'trending_up'
                : 'trending_down';

    return (
        <Paper elevation={3} sx={{
            flex: 1,
            p: 2,
            flexDirection: 'column',
            gap: 1,
            borderRadius: 3,
            minHeight: { xs: '120px', sm: 'auto' },
        }}>
            <Typography variant="subtitle1" color="primary.light">
                {t(`dashboard.dashhome.balance.${type.toLowerCase()}`)}
            </Typography>
            <Typography sx={{ fontWeight: '450', fontSize: '1.7rem' }}>
                {formatCurrency(amount, user)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: isPositiveTrend
                        ? theme.palette.status.success.bg
                        : theme.palette.status.error.bg,
                    color: isPositiveTrend
                        ? theme.palette.status.success.text
                        : theme.palette.status.error.text,
                    px: 1,
                    py: 0.3,
                    borderRadius: 2,
                    fontSize: '0.8rem'
                }}>
                    <span className="material-symbols-rounded">
                        {trendIcon}
                    </span>
                    {percentage.toFixed(1)}%
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {t('dashboard.dashhome.balance.thanLastMonth')}
                </Typography>
            </Box>
        </Paper>
    );
};

// HomeBalances component
export default function HomeBalances({ type, transactions, isLoading }: HomeBalancesProps) {

    // Get the balance data
    const balanceData = useMemo(() => {
        if (isLoading || transactions.length === 0) return { amount: 0, percentage: 0 };

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        const currentMonthTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.date);
            return date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth;
        });

        const previousMonthTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.date);
            return date.getFullYear() === previousYear && date.getMonth() + 1 === previousMonth;
        });

        let currentAmount = 0;
        let previousAmount = 0;

        if (type === 'income') {
            currentAmount = currentMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            previousAmount = previousMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
        } else if (type === 'expenses') {
            currentAmount = currentMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            previousAmount = previousMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        } else if (type === 'savings') {
            const currentIncome = currentMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const currentExpenses = currentMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            currentAmount = currentIncome - currentExpenses;

            const previousIncome = previousMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const previousExpenses = previousMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            previousAmount = previousIncome - previousExpenses;
        }

        const percentage = previousAmount === 0
            ? currentAmount === 0 ? 0 : 100
            : ((currentAmount - previousAmount) / previousAmount) * 100;

        return { amount: currentAmount, percentage };
    }, [transactions, isLoading, type]);

    // If the balance data is loading, show a skeleton
    if (isLoading) {
        return (
            <Paper elevation={3} sx={{
                flex: 1,
                p: 2,
                flexDirection: 'column',
                gap: 1,
                borderRadius: 3,
                minHeight: { xs: '120px', sm: 'auto' },
            }}>
                <Skeleton
                    variant="text"
                    width={80}
                    height={30}
                    sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                <Skeleton
                    variant="text"
                    width={120}
                    height={45}
                    sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton
                        variant="rectangular"
                        width={60}
                        height={20}
                        sx={{
                            borderRadius: 2,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                    <Skeleton
                        variant="text"
                        width={100}
                        height={24}
                        sx={{
                            borderRadius: 2,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </Box>
            </Paper>
        );
    }

    // Return the balance card
    return (
        <BalanceCard
            type={type === 'income' ? 'Earnings' : type === 'expenses' ? 'Spendings' : 'Savings'}
            amount={balanceData.amount}
            percentage={balanceData.percentage}
        />
    );
} 