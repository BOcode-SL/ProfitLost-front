import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Divider, Skeleton, useTheme } from '@mui/material';
import { toast } from 'react-hot-toast';

import { useUser } from '../../../../../contexts/UserContext';
import type { Transaction } from '../../../../../types/models/transaction';
import { transactionService } from '../../../../../services/transaction.service';
import type { TransactionApiSuccessResponse } from '../../../../../types/api/responses';
import { formatDateTime } from '../../../../../utils/dateUtils';
import { formatCurrency } from '../../../../../utils/formatCurrency';

export default function HomeHistory() {
    const { user } = useUser();
    const theme = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await transactionService.getAllTransactions();
                if (!response.success) {
                    throw new Error('Failed to fetch transactions');
                }

                const transactionsData = (response as TransactionApiSuccessResponse).data;
                if (!Array.isArray(transactionsData)) {
                    setTransactions([]);
                    return;
                }

                const now = new Date();
                const sortedTransactions = transactionsData
                    .filter((transaction): transaction is Transaction => {
                        if (!transaction) return false;
                        const transactionDate = new Date(transaction.date);
                        return transactionDate <= now;
                    })
                    .sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, 8);

                setTransactions(sortedTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                toast.error('Error loading transactions');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (isLoading) {
        return (
            <Paper sx={{
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
        <Paper sx={{
            gridArea: 'history',
            p: 2,
            borderRadius: 3,
            overflow: 'auto'
        }}>
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                Last transactions
            </Typography>
            {transactions.map((transaction, index) => (
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
                    {index < transactions.length - 1 && <Divider />}
                </Box>
            ))}
        </Paper>
    );
} 