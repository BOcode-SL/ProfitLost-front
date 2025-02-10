import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Fade, useTheme, Skeleton } from '@mui/material';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { CURRENCY_VISIBILITY_EVENT, formatCurrency, isCurrencyHidden } from '../../../../../utils/formatCurrency';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Interface for the props of the AnnualBalances component
interface AnnualBalancesProps {
    transactions: Transaction[]; // Array of transactions
    loading?: boolean; // Optional loading state
}

// AnnualBalances component
export default function AnnualBalances({ transactions, loading }: AnnualBalancesProps) {
    const { user } = useUser();
    const theme = useTheme();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

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

    // Prepare the balance items for display
    const balanceItems = [
        { label: 'download', value: totals.income, color: theme.palette.chart.income },
        { label: 'upload', value: totals.expenses, color: theme.palette.chart.expenses },
        { label: 'savings', value: totals.balance, color: totals.balance > 0 ? theme.palette.chart.income : theme.palette.chart.expenses }
    ];

    useEffect(() => {
        const handleVisibilityChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            setIsHidden(customEvent.detail.isHidden);
        };

        window.addEventListener(CURRENCY_VISIBILITY_EVENT, handleVisibilityChange);
        return () => {
            window.removeEventListener(CURRENCY_VISIBILITY_EVENT, handleVisibilityChange);
        };
    }, []);

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
            {/* Grid container for displaying balance items */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1,
                mt: 2
            }}>
                {/* Iterate over balance items to display each one */}
                {balanceItems.map(({ label, value, color }, index) => (
                    <Paper key={index} elevation={3} sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        {/* Icon representing the type of balance */}
                        <span className="material-symbols-rounded no-select" style={{ color, fontSize: '2rem' }}>{label}</span>
                        {/* Display formatted currency value */}
                        <span style={{
                            fontSize: '1.5rem',
                            filter: isHidden ? 'blur(8px)' : 'none',
                            transition: 'filter 0.3s ease'
                        }}>{formatCurrency(value, user)}</span>
                    </Paper>
                ))}
            </Box>
        </Fade>
    );
} 