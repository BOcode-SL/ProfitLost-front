import { useMemo } from 'react';
import { Box, Paper, Fade, useTheme, Skeleton } from '@mui/material';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { formatCurrency } from '../../../../../utils/formatCurrency';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Interface for the props of the AnnualBalances component
interface AnnualBalancesProps {
    transactions: Transaction[]; // Array of transactions
    loading?: boolean;
}

// AnnualBalances component
export default function AnnualBalances({ transactions, loading }: AnnualBalancesProps) {
    const { user } = useUser();
    const theme = useTheme();

    // Calculate the totals of the transactions
    const totals = useMemo(() => {
        const { income, expenses } = transactions.reduce((acc, transaction) => {
            if (transaction.amount > 0) {
                acc.income += transaction.amount;
            } else {
                acc.expenses += Math.abs(transaction.amount);
            }
            return acc;
        }, { income: 0, expenses: 0 });

        return {
            income,
            expenses,
            balance: income - expenses
        };
    }, [transactions]);

    // Calculate the balance items
    const balanceItems = [
        { label: 'download', value: totals.income, color: theme.palette.chart.income },
        { label: 'upload', value: totals.expenses, color: theme.palette.chart.expenses },
        { label: 'savings', value: totals.balance, color: totals.balance > 0 ? theme.palette.chart.income : theme.palette.chart.expenses }
    ];

    // If loading, show skeleton
    if (loading) {
        return (
            <Fade in timeout={700}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                    gap: 1,
                    mt: 2
                }}>
                    {[1, 2, 3].map((index) => (
                        <Paper key={index} elevation={3} sx={{
                            p: 1,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}>
                            <Skeleton 
                                variant="circular" 
                                width={32} 
                                height={32} 
                                sx={{ 
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} 
                            />
                            <Skeleton 
                                variant="text" 
                                width={100} 
                                height={32} 
                                sx={{ 
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} 
                            />
                        </Paper>
                    ))}
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in timeout={700}>
            {/* Container Grid for Balance Items */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1,
                mt: 2
            }}>
                {/* Mapping over balance items to display each balance */}
                {balanceItems.map(({ label, value, color }, index) => (
                    <Paper key={index} elevation={3} sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        {/* Icon representing the balance type */}
                        <span className="material-symbols-rounded no-select" style={{ color, fontSize: '2rem' }}>{label}</span>
                        {/* Formatted currency value */}
                        <span style={{ fontSize: '1.5rem' }}>{formatCurrency(value, user)}</span>
                    </Paper>
                ))}
            </Box>
        </Fade>
    );
} 