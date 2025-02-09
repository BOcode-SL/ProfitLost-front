import { Box, Paper, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Utils
import { formatCurrency } from '../../../../../utils/formatCurrency';

// Types
import type { User } from '../../../../../types/models/user';

// Interface for the props of the TransactionBalances component
interface TransactionBalancesProps {
    totalIncome: number; // Total income amount
    totalExpenses: number; // Total expenses amount
    user: User; // User information
}

// TransactionBalances component
export default function TransactionBalances({
    totalIncome,
    totalExpenses,
    user
}: TransactionBalancesProps) {
    const theme = useTheme();

    // Fade in effect for the container
    return (
        <Fade in timeout={500}>
            {/* Box to layout the transaction balances in a grid format */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1
            }}>
                {/* Paper component for total income display */}
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    {/* Icon for income */}
                    <span className="material-symbols-rounded no-select" style={{ color: theme.palette.chart.income, fontSize: '2rem' }}>download</span>
                    {/* Formatted income amount */}
                    <span style={{ fontSize: '1.5rem' }}>{formatCurrency(totalIncome, user)}</span>
                </Paper>

                {/* Paper component for total expenses display */}
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    {/* Icon for expenses */}
                    <span className="material-symbols-rounded no-select" style={{ color: theme.palette.chart.expenses, fontSize: '2rem' }}>upload</span>
                    {/* Formatted expenses amount */}
                    <span style={{ fontSize: '1.5rem' }}>{formatCurrency(totalExpenses, user)}</span>
                </Paper>

                {/* Paper component for net savings display */}
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    {/* Conditional rendering of savings icon based on net amount */}
                    <span className="material-symbols-rounded no-select" style={{ color: totalIncome - totalExpenses > 0 ? theme.palette.chart.income : theme.palette.chart.expenses, fontSize: '2rem' }}>savings</span>
                    {/* Formatted net savings amount */}
                    <span style={{ fontSize: '1.5rem' }}>{formatCurrency(totalIncome - totalExpenses, user)}</span>
                </Paper>
            </Box>
        </Fade>
    );
} 