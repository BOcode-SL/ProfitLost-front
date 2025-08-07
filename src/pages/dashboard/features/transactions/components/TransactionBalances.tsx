/**
 * TransactionBalances Module
 * 
 * Displays summarized financial metrics with visual indicators for income,
 * expenses, and net savings in a responsive grid layout.
 * 
 * Key Features:
 * - Visual representation of financial metrics with color-coded icons
 * - Dynamic currency formatting based on user locale and preferences
 * - Privacy mode with blurred monetary values for sensitive contexts
 * - Progressive loading with animated skeleton placeholders
 * - Responsive grid layout adapting to different screen sizes
 * - Real-time updates via visibility event listeners
 * 
 * @module TransactionBalances
 */
import { useState, useEffect } from 'react';
import { Box, Paper, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download, Upload } from 'react-feather';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Icons
import PiggyBank from '../../../../../icons/Piggy-Bank';

// Types
import type { UserWithPreferences } from '../../../../../contexts/UserContext';

/**
 * Props interface for the TransactionBalances component
 * 
 * @interface TransactionBalancesProps
 */
interface TransactionBalancesProps {
    /** Total income amount for the selected period */
    totalIncome: number;

    /** Total expenses amount for the selected period */
    totalExpenses: number;

    /** User information with formatting preferences */
    user: UserWithPreferences | null;

    /** Indicates if the data is currently loading */
    loading?: boolean;
}

/**
 * TransactionBalances Component
 * 
 * Displays three financial metric cards showing income, expenses, and net savings
 * with appropriate icons and color coding.
 * 
 * @param {TransactionBalancesProps} props - Component properties
 * @returns {JSX.Element} Rendered balance metrics component
 */
export default function TransactionBalances({
    totalIncome,
    totalExpenses,
    user,
    loading
}: TransactionBalancesProps) {
    const theme = useTheme();

    /** State tracking whether currency values should be blurred for privacy */
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

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
     * Render loading skeleton placeholders during data retrieval
     * Provides progressive visual feedback during loading
     */
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

    /**
     * Configuration for the three balance metric cards
     * Defines icon, value, and color for each financial metric
     */
    const balanceItems = [
        {
            label: 'download',
            value: totalIncome,
            color: theme.palette.chart.income,
            icon: <Download size={32} color={theme.palette.chart.income} />
        },
        {
            label: 'upload',
            value: totalExpenses,
            color: theme.palette.chart.expenses,
            icon: <Upload size={32} color={theme.palette.chart.expenses} />
        },
        {
            label: 'savings',
            value: totalIncome - totalExpenses,
            color: totalIncome - totalExpenses > 0 ? theme.palette.success.main : theme.palette.error.main,
            icon: <PiggyBank style={{ width: 32, height: 32, fill: totalIncome - totalExpenses > 0 ? theme.palette.success.main : theme.palette.error.main }} />
        }
    ];

    /**
     * Render the grid of balance metric cards
     * Displays income, expenses, and net savings with icons
     */
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
                    {/* Metric icon with appropriate color */}
                    <Box sx={{
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>{icon}</Box>

                    {/* Metric value with currency formatting and privacy blur */}
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