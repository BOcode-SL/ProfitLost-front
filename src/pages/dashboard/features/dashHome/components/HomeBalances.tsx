/**
 * HomeBalances Module
 * 
 * Provides metric cards displaying financial performance with month-over-month comparison.
 * 
 * Key Features:
 * - Dynamic trend indicators (up/down/flat) with contextual colors
 * - Intelligent percentage change calculation with edge case handling
 * - Currency formatting based on user preferences and locale
 * - Privacy mode with blurred monetary values
 * - Three distinct balance types: income, expenses, and net savings
 * - Responsive layout adapting to different screen sizes
 * - Loading skeleton animation during data retrieval
 * 
 * @module HomeBalances
 */
import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/supabase/transactions';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';
import { fromSupabaseTimestamp } from '../../../../../utils/dateUtils';

/**
 * Props interface for the HomeBalances component
 * 
 * @interface HomeBalancesProps
 */
interface HomeBalancesProps {
    /** Type of financial metric to display (income, expenses, or savings) */
    type: 'income' | 'expenses' | 'savings';
    
    /** Array of transactions to analyze for comparison */
    transactions: Transaction[];
    
    /** Indicates if data is currently loading */
    isLoading: boolean;
}

/**
 * BalanceCard Component
 * 
 * Renders an individual metric card with appropriate styling, trend indicators,
 * and percentage change visualization.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.type - The type of financial data to display (Earnings, Spendings, Savings)
 * @param {number} props.amount - The current period amount value
 * @param {number} props.percentage - The percentage change compared to previous period
 * @param {number} props.previousAmount - The amount from the previous period
 * @returns {JSX.Element} Rendered balance card
 */
const BalanceCard = ({ type, amount, percentage, previousAmount }:
    { type: string; amount: number; percentage: number; previousAmount: number }) => {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();
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
     * Determine if the trend direction is positive based on balance type
     * Different logic applies to different metric types:
     * - Savings: positive when current exceeds previous
     * - Expenses: positive when spending decreases
     * - Income: positive when earnings increase
     */
    const isPositiveTrend = type === 'Savings'
        ? (amount > previousAmount)  // For savings, positive if current amount exceeds previous
        : type === 'Spendings'
            ? percentage <= 0  // For spending, positive if spending decreased
            : percentage >= 0;  // For earnings, positive if earnings increased

    /**
     * Get the appropriate trend icon based on percentage change and metric type
     * Returns the correct icon component with styling
     * 
     * @returns {JSX.Element} Trend direction icon component
     */
    const getTrendIcon = () => {
        if (percentage === 0) {
            return <TrendingFlatIcon sx={{ fontSize: '1.2rem' }} />;
        }
        if (type === 'Spendings') {
            return isPositiveTrend ?
                <TrendingDownIcon sx={{ fontSize: '1.2rem' }} /> :
                <TrendingUpIcon sx={{ fontSize: '1.2rem' }} />;
        }
        return isPositiveTrend ?
            <TrendingUpIcon sx={{ fontSize: '1.2rem' }} /> :
            <TrendingDownIcon sx={{ fontSize: '1.2rem' }} />;
    };

    return (
        <Paper elevation={3} sx={{
            flex: 1,
            p: 2,
            flexDirection: 'column',
            gap: 1,
            borderRadius: 3,
            minHeight: { xs: '120px', sm: 'auto' },
        }}>
            {/* Balance type label with localized text */}
            <Typography variant="subtitle1" color="primary.light">
                {t(`dashboard.dashhome.balance.${type.toLowerCase()}`)}
            </Typography>
            {/* Current period amount with privacy protection */}
            <Typography
                sx={{
                    fontWeight: '450',
                    fontSize: '1.7rem',
                    filter: isHidden ? 'blur(8px)' : 'none',
                    transition: 'filter 0.3s ease',
                    userSelect: isHidden ? 'none' : 'auto'
                }}
            >
                {formatCurrency(amount, user)}
            </Typography>
            {/* Trend indicator with percentage change */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: isPositiveTrend
                        ? theme.palette.status.success.bg
                        : theme.palette.status.error.bg,
                    color: isPositiveTrend
                        ? theme.palette.status.success.text
                        : theme.palette.status.error.text,
                    px: 1,
                    py: 0.3,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    lineHeight: 1
                }}>
                    {/* Trend direction icon */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>
                        {getTrendIcon()}
                    </Box>
                    {/* Percentage change value */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1
                    }}>
                        {Math.abs(percentage).toFixed(1)}%
                    </Box>
                </Box>
                {/* Comparison period text */}
                <Typography variant="body2" color="text.secondary">
                    {t('dashboard.dashhome.balance.thanLastMonth')}
                </Typography>
            </Box>
        </Paper>
    );
};

/**
 * HomeBalances Component
 * 
 * Calculates financial metrics by comparing current and previous month data,
 * then renders the appropriate balance card with trend analysis.
 * 
 * @param {HomeBalancesProps} props - Component properties
 * @returns {JSX.Element} Rendered balance metric component
 */
export default function HomeBalances({ type, transactions, isLoading }: HomeBalancesProps) {

    /**
     * Calculate the balance metrics for current and previous periods
     * Processes transaction data to extract key financial metrics and trends
     */
    const balanceData = useMemo(() => {
        if (isLoading || transactions.length === 0) return { amount: 0, percentage: 0, previousAmount: 0 };

        // Get current date and determine current/previous month boundaries
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Define date ranges for comparison
        const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(previousYear, previousMonth - 1, 1);
        const lastDayOfPreviousMonth = new Date(currentYear, now.getMonth(), 0);

        // Filter transactions for current and previous month
        const currentMonthTransactions = transactions.filter(transaction => {
            const date = fromSupabaseTimestamp(transaction.transaction_date);
            return date >= firstDayOfMonth && date <= now;
        });
        const previousMonthTransactions = transactions.filter(transaction => {
            const date = fromSupabaseTimestamp(transaction.transaction_date);
            return date >= firstDayOfPreviousMonth && date <= lastDayOfPreviousMonth;
        });

        let currentAmount = 0;
        let previousAmount = 0;

        // Calculate amounts based on balance type with distinct logic for each
        if (type === 'income') {
            // For income, sum all positive transactions
            currentAmount = currentMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            previousAmount = previousMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
        } else if (type === 'expenses') {
            // For expenses, sum absolute values of all negative transactions
            currentAmount = currentMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            previousAmount = previousMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        } else if (type === 'savings') {
            // For savings, calculate income minus expenses for both periods
            const currentIncome = currentMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const currentExpenses = currentMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            currentAmount = currentIncome - currentExpenses;

            const previousIncome = previousMonthTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const previousExpenses = previousMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            previousAmount = previousIncome - previousExpenses;
        }

        // Calculate percentage change with edge case handling for division by zero
        const percentage = previousAmount === 0
            ? currentAmount === 0 ? 0 : 100
            : ((currentAmount - previousAmount) / previousAmount) * 100;

        return { amount: currentAmount, percentage, previousAmount };
    }, [transactions, isLoading, type]);

    /**
     * Render loading skeleton while data is being fetched
     * Provides visual feedback during data loading
     */
    if (isLoading) {
        return (
            <Paper elevation={3} sx={{
                flex: 1,
                p: 2,
                flexDirection: 'column',
                gap: 1,
                borderRadius: 3,
                minHeight: { xs: '120px', sm: 'auto' },
            }}>
                {/* Title skeleton */}
                <Skeleton
                    variant="text"
                    width={80}
                    height={30}
                    sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                {/* Amount skeleton */}
                <Skeleton
                    variant="text"
                    width={120}
                    height={45}
                    sx={{
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                {/* Trend indicator skeleton */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton
                        variant="rectangular"
                        width={60}
                        height={20}
                        sx={{
                            borderRadius: 2,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                    <Skeleton
                        variant="text"
                        width={100}
                        height={24}
                        sx={{
                            borderRadius: 2,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </Box>
            </Paper>
        );
    }

    // Render the appropriate balance card with calculated metrics
    return (
        <BalanceCard
            type={type === 'income' ? 'Earnings' : type === 'expenses' ? 'Spendings' : 'Savings'}
            amount={balanceData.amount}
            percentage={balanceData.percentage}
            previousAmount={balanceData.previousAmount}
        />
    );
} 