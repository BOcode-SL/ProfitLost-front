import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { toast } from 'react-hot-toast';

import { useUser } from '../../../../../contexts/UserContext';
import type { Transaction } from '../../../../../types/models/transaction';
import { transactionService } from '../../../../../services/transaction.service';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface HomeBalancesProps {
    income?: boolean;
    expenses?: boolean;
    savings?: boolean;
}

interface BalanceData {
    amount: number;
    percentage: number;
}

const BalanceCardSkeleton = () => (
    <Paper sx={{
        flex: 1,
        p: 2,
        flexDirection: 'column',
        gap: 1,
        borderRadius: 3,
        minHeight: { xs: '120px', sm: 'auto' },
    }}>
        <Skeleton width={80} height={24} />
        <Skeleton width={120} height={35} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton width={60} height={20} />
            <Skeleton width={100} height={20} />
        </Box>
    </Paper>
);

const BalanceCard = ({ type, amount, percentage }: { type: string; amount: number; percentage: number }) => {
    const { user } = useUser();

    return (
        <Paper sx={{
            flex: 1,
            p: 2,
            flexDirection: 'column',
            gap: 1,
            borderRadius: 3,
            minHeight: { xs: '120px', sm: 'auto' },
        }}>
            <Typography variant="subtitle1" color="primary.light">
                {type}
            </Typography>
            <Typography sx={{ fontWeight: '450', fontSize: '1.7rem' }}>
                {formatCurrency(amount, user)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: percentage > 0 ? '#e8f5e9' : '#ffebee',
                    color: percentage > 0 ? '#2e7d32' : '#d32f2f',
                    px: 1,
                    py: 0.3,
                    borderRadius: 2,
                    fontSize: '0.8rem'
                }}>
                    <span className="material-symbols-rounded">
                        {percentage > 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {percentage.toFixed(1)}%
                </Box>
                <Typography variant="body2" color="text.secondary">
                    than last month
                </Typography>
            </Box>
        </Paper>
    );
};

export default function HomeBalances({ income, expenses, savings }: HomeBalancesProps) {
    const [balanceData, setBalanceData] = useState<BalanceData>({ amount: 0, percentage: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await transactionService.getAllTransactions();
                if (!response.success) {
                    throw new Error('Failed to fetch transactions');
                }

                const transactions = response.data as Transaction[];
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

                if (income) {
                    currentAmount = currentMonthTransactions
                        .filter(t => t.amount > 0)
                        .reduce((sum, t) => sum + t.amount, 0);
                    previousAmount = previousMonthTransactions
                        .filter(t => t.amount > 0)
                        .reduce((sum, t) => sum + t.amount, 0);
                } else if (expenses) {
                    currentAmount = currentMonthTransactions
                        .filter(t => t.amount < 0)
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    previousAmount = previousMonthTransactions
                        .filter(t => t.amount < 0)
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                } else if (savings) {
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

                setBalanceData({ amount: currentAmount, percentage });

            } catch (error) {
                console.error('Error fetching balances:', error);
                toast.error('Error loading balances');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalances();
    }, [income, expenses, savings]);

    if (isLoading) {
        return <BalanceCardSkeleton />;
    }

    const type = income ? 'Earnings' : expenses ? 'Spendings' : 'Savings';

    return (
        <BalanceCard 
            type={type}
            amount={balanceData.amount}
            percentage={balanceData.percentage}
        />
    );
} 