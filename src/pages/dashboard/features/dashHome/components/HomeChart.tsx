/**
 * HomeChart Module
 * 
 * Renders a comparative visualization of income vs. expenses over a six-month period.
 * 
 * Key Features:
 * - Automatically calculates and summarizes financial data by month
 * - Dynamic legend with income/expense color coding
 * - Intelligent empty state handling with appropriate messaging
 * - Currency formatting based on user preferences and locale
 * - Privacy mode with blurred monetary values and disabled tooltips
 * - Responsive design adapting to different screen sizes
 * - Optimized data processing with memoization
 * 
 * @module HomeChart
 */
import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, Skeleton, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/supabase/transactions';
/**
 * Structured monthly financial data for chart visualization
 * 
 * @interface MonthlyData
 */
interface MonthlyData {
    /** Month name abbreviation (localized) */
    month: string;
    /** Total income amount for the month */
    income: number;
    /** Total expense amount for the month */
    expenses: number;
}

// Utils
import {
    formatCurrency,
    isCurrencyHidden,
    CURRENCY_VISIBILITY_EVENT,
    formatLargeNumber
} from '../../../../../utils/currencyUtils';
import { fromSupabaseTimestamp } from '../../../../../utils/dateUtils';

/**
 * Props interface for the HomeChart component
 * 
 * @interface HomeChartProps
 */
interface HomeChartProps {
    /** Array of transactions to analyze and visualize */
    transactions: Transaction[];
    
    /** Indicates if the chart data is currently loading */
    isLoading: boolean;
}

/**
 * Standard month abbreviations in English
 * Used for consistent data processing regardless of display language
 */
const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * HomeChart Component
 * 
 * Visualizes income and expense trends over a six-month period using a line chart,
 * with support for currency formatting and privacy features.
 * 
 * @param {HomeChartProps} props - Component properties
 * @returns {JSX.Element} Rendered chart component
 */
export default function HomeChart({ transactions, isLoading }: HomeChartProps) {
    const { user } = useUser();
    const theme = useTheme();
    const { t } = useTranslation();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

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
     * Process transactions into monthly income and expense totals
     * Creates a six-month dataset suitable for chart visualization
     */
    const monthlyDataMemo = useMemo(() => {
        if (isLoading || transactions.length === 0) return [];

        const today = new Date();
        const monthlyDataMap: { [key: string]: { income: number; expenses: number } } = {};

        // Initialize data structure for the last six months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = MONTH_KEYS[date.getMonth()];
            monthlyDataMap[monthKey] = { income: 0, expenses: 0 };
        }

        // Calculate the date six months ago for filtering
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Filter transactions to include only those within the last six months
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = fromSupabaseTimestamp(transaction.transaction_date);
            return transactionDate >= sixMonthsAgo && transactionDate <= today;
        });

        // Categorize and sum transactions by month and type (income/expense)
        filteredTransactions.forEach(transaction => {
            const transactionDate = fromSupabaseTimestamp(transaction.transaction_date);
            const monthKey = MONTH_KEYS[transactionDate.getMonth()];

            if (monthlyDataMap[monthKey]) {
                if (transaction.amount > 0) {
                    monthlyDataMap[monthKey].income += transaction.amount;
                } else {
                    monthlyDataMap[monthKey].expenses += Math.abs(transaction.amount);
                }
            }
        });

        // Format data for chart consumption with localized month names
        const chartData: MonthlyData[] = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = MONTH_KEYS[date.getMonth()];
            // Get localized month name based on current language
            const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
            chartData.push({
                month: translatedMonth,
                income: Number(monthlyDataMap[monthKey].income.toFixed(2)),
                expenses: Number(monthlyDataMap[monthKey].expenses.toFixed(2))
            });
        }

        return chartData;
    }, [transactions, isLoading, t]);

    /**
     * Update state when memoized data changes
     * Prevents unnecessary recalculations while ensuring state is updated
     */
    useEffect(() => {
        setMonthlyData(monthlyDataMemo);
    }, [monthlyDataMemo]);

    /**
     * Render loading skeleton during data processing
     * Provides visual feedback while waiting for data
     */
    if (isLoading) {
        return (
            <Paper elevation={3} sx={{
                gridArea: 'chart',
                p: 2,
                borderRadius: 3,
                height: { xs: 'auto', sm: 'auto' }
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
                <Skeleton
                    variant="rectangular"
                    sx={{
                        borderRadius: 3,
                        height: 275,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
            </Paper>
        );
    }

    /**
     * Determine if there is meaningful financial data to display
     * Checks if all months have zero values for both income and expenses
     */
    const isDataEmpty = monthlyData.length === 0 ||
        monthlyData.every(item => item.income === 0 && item.expenses === 0);

    /**
     * Render empty state when no financial data exists
     * Shows a chart with placeholder data and an explanatory message
     */
    if (isDataEmpty) {
        // Generate empty month labels for the last six months
        const today = new Date();
        const emptyMonths = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = MONTH_KEYS[date.getMonth()];
            const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
            emptyMonths.push(translatedMonth);
        }

        return (
            <Paper
                elevation={3}
                sx={{
                    gridArea: 'chart',
                    p: 2,
                    borderRadius: 3
                }}>
                {/* Chart title */}
                <Typography variant="subtitle1" color="primary.light" gutterBottom>
                    {t('dashboard.transactions.chart.monthlyBalance')}
                </Typography>
                {/* Chart container with "no data" overlay */}
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '280px'
                }}>
                    {/* Empty chart with zero values for baseline visualization */}
                    <LineChart
                        series={[
                            {
                                data: [0, 0, 0, 0, 0, 0],
                                label: t('dashboard.transactions.chart.income'),
                                color: theme.palette.chart.income,
                                valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                                showMark: false
                            },
                            {
                                data: [0, 0, 0, 0, 0, 0],
                                label: t('dashboard.transactions.chart.expenses'),
                                color: theme.palette.chart.expenses,
                                valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                                showMark: false
                            }
                        ]}
                        xAxis={[{
                            data: emptyMonths,
                            scaleType: 'point'
                        }]}
                        yAxis={[{
                            tickNumber: 3,
                            sx: {
                                text: {
                                    filter: isHidden ? 'blur(8px)' : 'none',
                                    transition: 'filter 0.3s ease'
                                }
                            },
                            valueFormatter: (value: number) => formatLargeNumber(value)
                        }]}
                        height={280}
                        margin={{
                            top: 25,
                            left: 50,
                            right: 35,
                            bottom: 25
                        }}
                        slotProps={{
                            legend: {
                                hidden: true
                            }
                        }}
                        tooltip={isHidden ? {
                            trigger: 'none' // Disable tooltips when privacy mode is active
                        } : {
                            trigger: 'axis' // Show tooltips on hover
                        }}
                    />
                    {/* Empty state message overlay */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            px: 2,
                            py: 1,
                            borderRadius: 1
                        }}>
                        {t('dashboard.dashhome.chart.noDataLast6Months')}
                    </Typography>
                </Box>
            </Paper>
        );
    }

    /**
     * Render chart with actual financial data
     * Displays income and expense trends with full interactivity
     */
    return (
        <Paper
            elevation={3}
            sx={{
                gridArea: 'chart',
                p: 2,
                borderRadius: 3
            }}>
            {/* Chart title */}
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                {t('dashboard.dashhome.chart.last6MonthsBalance')}
            </Typography>
            {/* Chart container */}
            <Box sx={{
                width: '100%',
                height: '280px'
            }}>
                {/* Financial data line chart */}
                <LineChart
                    series={[
                        {
                            data: monthlyData.map(d => d.income),
                            label: t('dashboard.transactions.chart.income'),
                            color: theme.palette.chart.income,
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                            showMark: false
                        },
                        {
                            data: monthlyData.map(d => d.expenses),
                            label: t('dashboard.transactions.chart.expenses'),
                            color: theme.palette.chart.expenses,
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                            showMark: false
                        }
                    ]}
                    xAxis={[{
                        data: monthlyData.map(d => d.month),
                        scaleType: 'point'
                    }]}
                    yAxis={[{
                        tickNumber: 3,
                        sx: {
                            text: {
                                filter: isHidden ? 'blur(8px)' : 'none',
                                transition: 'filter 0.3s ease'
                            }
                        },
                        valueFormatter: (value: number) => formatLargeNumber(value)
                    }]}
                    height={280}
                    margin={{
                        top: 25,
                        bottom: 25
                    }}
                    slotProps={{
                        legend: {
                            hidden: true
                        }
                    }}
                    tooltip={isHidden ? {
                        trigger: 'none' // Disable tooltips when privacy mode is active
                    } : {
                        trigger: 'axis' // Show tooltips on hover
                    }}
                />
            </Box>
        </Paper>
    );
}