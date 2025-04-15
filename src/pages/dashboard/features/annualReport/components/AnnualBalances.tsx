/**
 * AnnualBalances Module
 * 
 * Provides summary financial metrics for annual reporting in a visually appealing card layout.
 * 
 * Key Features:
 * - Income, expense, and net balance display with appropriate visual indicators
 * - Currency formatting based on user preferences and locale
 * - Privacy mode with blurred monetary values for sensitive information
 * - Color-coded indicators for positive/negative values
 * - Responsive grid layout adapting to different screen sizes
 * - Loading skeleton state with animation during data retrieval
 * 
 * @module AnnualBalances
 */
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
import type { Transaction } from '../../../../../types/supabase/transactions';

/**
 * Props interface for the AnnualBalances component
 * 
 * @interface AnnualBalancesProps
 */
interface AnnualBalancesProps {
    /** Array of transactions to calculate balance summaries from */
    transactions: Transaction[];
    
    /** Indicates if data is currently loading */
    isLoading: boolean;
}

/**
 * AnnualBalances Component
 * 
 * Renders three cards showing income total, expense total, and net balance with
 * appropriate icons and color coding.
 * 
 * @param {AnnualBalancesProps} props - Component properties
 * @returns {JSX.Element} Rendered balance cards
 */
export default function AnnualBalances({ transactions, isLoading }: AnnualBalancesProps) {
    const { user } = useUser();
    const theme = useTheme();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    /**
     * Calculate income, expenses, and net balance from transaction data
     * Processes all transactions and aggregates the financial totals
     */
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

    /**
     * Configuration for the three balance cards with their respective icons and colors
     * Each item represents one card to be displayed in the grid
     */
    const balanceItems = [
        { 
            label: 'download', 
            value: totals.income, 
            color: theme.palette.chart.income, 
            icon: <FileDownloadOutlinedIcon sx={{ fontSize: '2rem' }} /> 
        },
        { 
            label: 'upload', 
            value: totals.expenses, 
            color: theme.palette.chart.expenses, 
            icon: <FileUploadOutlinedIcon sx={{ fontSize: '2rem' }} /> 
        },
        { 
            label: 'savings', 
            value: totals.balance, 
            color: totals.balance > 0 ? theme.palette.chart.income : theme.palette.chart.expenses, 
            icon: <SavingsOutlinedIcon sx={{ fontSize: '2rem' }} /> 
        }
    ];

    /**
     * Listen for currency visibility toggle events across the application
     * Updates local component state when visibility changes elsewhere
     */
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

    /**
     * Render skeleton loaders while data is being fetched
     * Shows placeholder cards with animated pulse effect
     */
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
            {/* Financial metric cards: income, expenses, and balance */}
            {balanceItems.map(({ value, color, icon }, index) => (
                <Paper key={index} elevation={3} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    {/* Icon with appropriate color for financial metric type */}
                    <Box sx={{ 
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>{icon}</Box>
                    {/* Financial value with privacy blur support */}
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