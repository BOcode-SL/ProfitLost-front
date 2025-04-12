/**
 * TransactionBalances Component
 * 
 * Displays financial balance summaries with income, expenses, and savings indicators.
 * Features include:
 * - Visual representation of financial metrics with appropriate icons
 * - Currency formatting based on user preferences
 * - Support for currency visibility toggling for privacy
 * - Loading state with animated skeletons
 * - Responsive grid layout for different screen sizes
 */
import { useState, useEffect } from 'react';
import { Box, Paper, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Types
import type { UserWithPreferences } from '../../../../../contexts/UserContext';

// Interface for the props of the TransactionBalances component
interface TransactionBalancesProps {
    totalIncome: number; // Total income amount
    totalExpenses: number; // Total expenses amount
    user: UserWithPreferences | null; // User information with preferences
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

    // If loading, show skeleton placeholders for better UX
    if (loading) {
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

    // Prepare data for the three balance indicators: income, expenses, and net savings
    const balanceItems = [
        { 
            label: 'download', 
            value: totalIncome, 
            color: theme.palette.chart.income, 
            icon: <FileDownloadOutlinedIcon sx={{ fontSize: '2rem' }} /> 
        },
        { 
            label: 'upload', 
            value: totalExpenses, 
            color: theme.palette.chart.expenses, 
            icon: <FileUploadOutlinedIcon sx={{ fontSize: '2rem' }} /> 
        },
        { 
            label: 'savings', 
            value: totalIncome - totalExpenses, 
            color: totalIncome - totalExpenses > 0 ? theme.palette.chart.income : theme.palette.chart.expenses, 
            icon: <SavingsOutlinedIcon sx={{ fontSize: '2rem' }} /> 
        }
    ];

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2
        }}>
            {balanceItems.map(({ value, color, icon }, index) => (
                <Paper key={index} elevation={3} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    <Box sx={{ 
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>{icon}</Box>
                    <Box sx={{ 
                        fontSize: '1.5rem',
                        filter: isHidden ? 'blur(8px)' : 'none',
                        transition: 'filter 0.3s ease',
                        userSelect: isHidden ? 'none' : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>{formatCurrency(value, user)}</Box>
                </Paper>
            ))}
        </Box>
    );
} 