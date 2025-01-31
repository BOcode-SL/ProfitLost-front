import { useMemo } from 'react';
import { Box, Paper, Typography, Divider, Skeleton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../../contexts/UserContext';
import type { Transaction } from '../../../../../types/models/transaction';
import { formatDateTime } from '../../../../../utils/dateUtils';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface HomeHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
}

export default function HomeHistory({ transactions, isLoading }: HomeHistoryProps) {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();

    const recentTransactionsMemo = useMemo(() => {
        if (isLoading || transactions.length === 0) return [];

        const now = new Date();
        return transactions
            .filter((transaction): transaction is Transaction => {
                if (!transaction) return false;
                const transactionDate = new Date(transaction.date);
                return transactionDate <= now;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 8);
    }, [transactions, isLoading]);

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
                <Skeleton width={200} height={24} sx={{ mb: 2 }} />
                {[...Array(8)].map((_, index) => (
                    <Box key={index} sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Skeleton width={120} height={19} />
                                <Skeleton width={80} height={18} />
                            </Box>
                            <Skeleton width={60} height={19} />
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
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                {t('dashboard.dashhome.history.lastTransactions')}
            </Typography>
            {recentTransactionsMemo.map((transaction, index) => (
                <Box key={transaction._id}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1
                    }}>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                {transaction.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formatDateTime(transaction.date, user)}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: transaction.amount > 0 ? theme.palette.chart.income : theme.palette.chart.expenses,
                                fontWeight: 'medium'
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