import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, useTheme, Skeleton } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { CURRENCY_VISIBILITY_EVENT, formatCurrency, isCurrencyHidden } from '../../../../../utils/currencyUtils';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Interface for the props of the AnnualBalances component
interface AnnualBalancesProps {
    transactions: Transaction[]; // Array of transactions
    isLoading: boolean; // Loading state
}

// AnnualBalances component
export default function AnnualBalances({ transactions, isLoading }: AnnualBalancesProps) {
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
        { label: 'download', value: totals.income, color: theme.palette.chart.income, icon: <FileDownloadOutlinedIcon sx={{ fontSize: '2rem' }} /> },
        { label: 'upload', value: totals.expenses, color: theme.palette.chart.expenses, icon: <FileUploadOutlinedIcon sx={{ fontSize: '2rem' }} /> },
        { label: 'savings', value: totals.balance, color: totals.balance > 0 ? theme.palette.chart.income : theme.palette.chart.expenses, icon: <SavingsOutlinedIcon sx={{ fontSize: '2rem' }} /> }
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
    if (isLoading) {
        return (
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 2
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
                            height={36}
                            sx={{
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }}
                        />
                    </Paper>
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2
        }}>
            {/* Iterate over balance items to display each one */}
            {balanceItems.map(({ value, color, icon }, index) => (
                <Paper key={index} elevation={3} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    {/* Icon representing the type of balance */}
                    <Box sx={{ 
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>{icon}</Box>
                    {/* Display formatted currency value */}
                    <Box sx={{
                        fontSize: '1.5rem',
                        filter: isHidden ? 'blur(8px)' : 'none',
                        transition: 'filter 0.3s ease',
                        userSelect: isHidden ? 'none' : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>
                        {formatCurrency(value, user)}
                    </Box>
                </Paper>
            ))}
        </Box>
    );
} 