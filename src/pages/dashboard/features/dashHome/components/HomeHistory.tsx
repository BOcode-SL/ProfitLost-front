import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Typography, Divider, Skeleton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Utils
import { formatDateTime, fromUTCString } from '../../../../../utils/dateUtils';
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Interface for the props of the HomeHistory component
interface HomeHistoryProps {
    transactions: Transaction[]; // Array of transactions
    isLoading: boolean; // Indicates if the component is currently loading data
}

// HomeHistory component
export default function HomeHistory({ transactions, isLoading }: HomeHistoryProps) {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    // Listen for changes in currency visibility
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

    // Retrieve recent transactions
    const recentTransactionsMemo = useMemo(() => {
        if (isLoading || transactions.length === 0) return [];

        const now = new Date();
        return transactions
            .filter((transaction): transaction is Transaction => {
                if (!transaction) return false;
                const transactionDate = fromUTCString(transaction.date);
                return transactionDate <= now; // Filter transactions that are not in the future
            })
            .sort((a, b) => fromUTCString(b.date).getTime() - fromUTCString(a.date).getTime()) // Sort transactions by date
            .slice(0, 8); // Limit to the most recent 8 transactions
    }, [transactions, isLoading]);

    // Show a skeleton while transactions are loading
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
                <Skeleton
                    variant="text"
                    width={200}
                    height={24}
                    sx={{
                        mb: 2,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                {[...Array(8)].map((_, index) => (
                    <Box key={index} sx={{ py: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
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

    // Paper container for the transaction history section
    return (
        <Paper
            elevation={3}
            sx={{
                gridArea: 'history',
                p: 2,
                borderRadius: 3,
                overflow: 'auto'
            }}>
            {/* Title of the transaction history section */}
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                {t('dashboard.dashhome.history.lastTransactions')}
            </Typography>
            {/* Iterate through recent transactions */}
            {recentTransactionsMemo.map((transaction, index) => (
                <Box key={transaction._id}>
                    {/* Container for each transaction item */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1
                    }}>
                        <Box>
                            {/* Description of the transaction */}
                            <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                {transaction.description}
                            </Typography>
                            {/* Date of the transaction */}
                            <Typography variant="body2" color="text.secondary">
                                {formatDateTime(transaction.date, user)}
                            </Typography>
                        </Box>
                        {/* Amount of the transaction */}
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
                    {index < recentTransactionsMemo.length - 1 && <Divider />}
                </Box>
            ))}
        </Paper>
    );
}