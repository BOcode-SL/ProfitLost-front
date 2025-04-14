/**
 * HomeHistory Component
 * 
 * Displays the most recent financial transactions in a list format.
 * Features include:
 * - Automatic sorting of transactions by date (newest first)
 * - Color-coded transaction amounts (income vs expenses)
 * - Currency formatting based on user preferences
 * - Support for currency visibility toggling for privacy
 * - Empty state handling when no transactions exist
 * - Responsive design for different screen sizes
 * - Loading skeleton state while data is being processed
 */
import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Typography, Divider, Skeleton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/supabase/transactions';

// Utils
import { formatDateTime, fromSupabaseTimestamp } from '../../../../../utils/dateUtils';
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Interface for the props of the HomeHistory component
interface HomeHistoryProps {
    transactions: Transaction[]; // Array of transactions to display
    isLoading: boolean; // Indicates if the component is currently loading data
}

// Function to generate unique keys for transactions
const generateTransactionKey = (transaction: Transaction) => {
    if (!transaction || !transaction.id) {
        // Generate a random ID for cases where there is no ID
        return `transaction-${Math.random().toString(36).substring(2, 9)}`;
    }
    // Combine ID with timestamp to avoid duplicates
    return `transaction-${transaction.id}-${new Date(transaction.transaction_date).getTime()}`;
};

// HomeHistory component
export default function HomeHistory({ transactions, isLoading }: HomeHistoryProps) {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    // Listen for currency visibility toggle events across the application
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

    // Get the 8 most recent transactions sorted by date
    const recentTransactionsMemo = useMemo(() => {
        if (isLoading || transactions.length === 0) return [];

        const now = new Date();
        return transactions
            .filter((transaction): transaction is Transaction => {
                if (!transaction) return false;
                const transactionDate = fromSupabaseTimestamp(transaction.transaction_date);
                return transactionDate <= now; // Exclude future-dated transactions
            })
            .sort((a, b) => fromSupabaseTimestamp(b.transaction_date).getTime() - fromSupabaseTimestamp(a.transaction_date).getTime()) // Sort newest first
            .slice(0, 8); // Limit to most recent 8 transactions
    }, [transactions, isLoading]);

    // Display skeleton loader while data is loading
    if (isLoading) {
        return (
            <Paper
                elevation={3}
                sx={{
                    gridArea: 'history',
                    p: 2,
                    borderRadius: 3,
                    overflow: 'auto'
                }}>
                {/* Title skeleton */}
                <Skeleton
                    variant="text"
                    width={200}
                    height={24}
                    sx={{
                        mb: 2,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                {/* Transaction list item skeletons */}
                {[...Array(8)].map((_, index) => (
                    <Box key={`skeleton-${index}`} sx={{ py: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {/* Left side - description and date */}
                            <Box>
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={19}
                                    sx={{
                                        animation: 'pulse 1.5s ease-in-out infinite'
                                    }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={80}
                                    height={18}
                                    sx={{
                                        animation: 'pulse 1.5s ease-in-out infinite'
                                    }}
                                />
                            </Box>
                            {/* Right side - amount */}
                            <Skeleton
                                variant="text"
                                width={60}
                                height={19}
                                sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}
                            />
                        </Box>
                        {index < 7 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                ))}
            </Paper>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                gridArea: 'history',
                p: 2,
                borderRadius: 3,
                overflow: 'auto'
            }}>
            {/* Section title */}
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                {t('dashboard.dashhome.history.lastTransactions')}
            </Typography>
            {/* Empty state message when no transactions exist */}
            {recentTransactionsMemo.length === 0 ? (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        {t('dashboard.dashhome.history.noDataLastTransactions')}
                    </Typography>
                </Box>
            ) : (
                /* List of recent transactions */
                recentTransactionsMemo.map((transaction, index) => (
                    <Box key={generateTransactionKey(transaction)}>
                        {/* Transaction item */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1
                        }}>
                            {/* Left section - transaction details */}
                            <Box>
                                {/* Transaction description */}
                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                    {transaction.description}
                                </Typography>
                                {/* Transaction date and time */}
                                <Typography variant="body2" color="text.secondary">
                                    {formatDateTime(transaction.transaction_date, user)}
                                </Typography>
                            </Box>
                            {/* Transaction amount with color coding and privacy support */}
                            <Typography
                                variant="body1"
                                sx={{
                                    color: transaction.amount > 0 ? theme.palette.chart.income : theme.palette.chart.expenses,
                                    fontWeight: 'medium',
                                    filter: isHidden ? 'blur(8px)' : 'none',
                                    transition: 'filter 0.3s ease',
                                    userSelect: isHidden ? 'none' : 'auto'
                                }}
                            >
                                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, user)}
                            </Typography>
                        </Box>
                        {/* Divider between transactions (except after the last one) */}
                        {index < recentTransactionsMemo.length - 1 && <Divider />}
                    </Box>
                ))
            )}
        </Paper>
    );
}