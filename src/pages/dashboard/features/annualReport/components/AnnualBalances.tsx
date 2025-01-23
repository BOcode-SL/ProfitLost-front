import { useMemo } from 'react';
import { Box, Paper, Fade, useTheme } from '@mui/material';

import { useUser } from '../../../../../contexts/UserContext';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { Transaction } from '../../../../../types/models/transaction';

interface AnnualBalancesProps {
    transactions: Transaction[];
}

export default function AnnualBalances({ transactions }: AnnualBalancesProps) {
    const { user } = useUser();
    const theme = useTheme();

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

    return (
        <Fade in timeout={700}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1,
                mt: 2
            }}>
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    <span className="material-symbols-rounded no-select" style={{ color: theme.palette.chart.income, fontSize: '2rem' }}>
                        download
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>
                        {formatCurrency(totals.income, user)}
                    </span>
                </Paper>

                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    <span className="material-symbols-rounded no-select" style={{ color: theme.palette.chart.expenses, fontSize: '2rem' }}>
                        upload
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>
                        {formatCurrency(totals.expenses, user)}
                    </span>
                </Paper>

                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    {totals.balance > 0 ? (
                        <span className="material-symbols-rounded no-select" style={{ color: theme.palette.chart.income, fontSize: '2rem' }}>
                            savings
                        </span>
                    ) : (
                        <span className="material-symbols-rounded no-select" style={{ color: theme.palette.chart.expenses, fontSize: '2rem' }}>
                            savings
                        </span>
                    )}
                    <span style={{ fontSize: '1.5rem' }}>
                        {formatCurrency(totals.balance, user)}
                    </span>
                </Paper>
            </Box>
        </Fade>
    );
} 