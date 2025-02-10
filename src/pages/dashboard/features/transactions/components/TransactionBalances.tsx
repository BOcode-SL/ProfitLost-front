import { useState, useEffect } from 'react';
import { Box, Paper, Fade, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/formatCurrency';

// Types
import type { User } from '../../../../../types/models/user';

// Interface for the props of the TransactionBalances component
interface TransactionBalancesProps {
    totalIncome: number; // Total income amount
    totalExpenses: number; // Total expenses amount
    user: User; // User information
    loading?: boolean; // Indicates if the data is currently loading
}

// TransactionBalances component
export default function TransactionBalances({
    totalIncome,
    totalExpenses,
    user,
    loading
}: TransactionBalancesProps) {
    const theme = useTheme();

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

    // If loading, show skeletons
    if (loading) {
        return (
            <Fade in timeout={500}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                    gap: 1
                }}>
                    {[1, 2, 3].map((index) => (
                        <Paper key={index} elevation={2} sx={{
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

    const balanceItems = [
        { label: 'download', value: totalIncome, color: theme.palette.chart.income },
        { label: 'upload', value: totalExpenses, color: theme.palette.chart.expenses },
        { label: 'savings', value: totalIncome - totalExpenses, color: totalIncome - totalExpenses > 0 ? theme.palette.chart.income : theme.palette.chart.expenses }
    ];

    return (
        <Fade in timeout={500}>
            {/* Box to layout the transaction balances in a grid format */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1
            }}>
                {balanceItems.map(({ label, value, color }, index) => (
                    <Paper key={index} elevation={2} sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        <span className="material-symbols-rounded no-select" style={{ color, fontSize: '2rem' }}>{label}</span>
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