import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Fade } from '@mui/material';

import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { User } from '../../../../../types/models/user';

interface TransactionBalancesProps {
    totalIncome: number;
    totalExpenses: number;
    user: User;
}

export default function TransactionBalances({ 
    totalIncome,
    totalExpenses,
    user 
}: TransactionBalancesProps) {
    return (
        <Fade in timeout={500}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1
            }}>
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    <span className="material-symbols-rounded" style={{ color: '#ff8e38', fontSize: '2rem' }}>
                        download
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>
                        {formatCurrency(totalIncome, user)}
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
                    <span className="material-symbols-rounded" style={{ color: '#9d300f', fontSize: '2rem' }}>
                        upload
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>
                        {formatCurrency(totalExpenses, user)}
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
                    {totalIncome - totalExpenses > 0 ? (
                        <span className="material-symbols-rounded" style={{ color: '#4CAF50', fontSize: '2rem' }}>
                            savings
                        </span>
                    ) : (
                        <span className="material-symbols-rounded" style={{ color: '#f44336', fontSize: '2rem' }}>
                            savings
                        </span>
                    )}
                    <span style={{ fontSize: '1.5rem' }}>
                        {formatCurrency(totalIncome - totalExpenses, user)}
                    </span>
                </Paper>
            </Box>
        </Fade>
    );
} 