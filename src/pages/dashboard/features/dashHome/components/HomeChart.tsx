/**
 * HomeChart Component
 * 
 * Displays a line chart showing income and expenses trends over the last six months.
 * Features include:
 * - Dynamic data calculation from transaction history
 * - Month-by-month comparison of income vs expenses
 * - Currency formatting based on user preferences
 * - Support for currency visibility toggling for privacy
 * - Empty state handling when no transaction data exists
 * - Responsive design for different screen sizes
 * - Loading skeleton state while data is being processed
 */
import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, Skeleton, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';
interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
}

// Utils
import {
    formatCurrency,
    isCurrencyHidden,
    CURRENCY_VISIBILITY_EVENT,
    formatLargeNumber
} from '../../../../../utils/currencyUtils';
import { fromUTCtoLocal } from '../../../../../utils/dateUtils';

// Interface for the props of the HomeChart component
interface HomeChartProps {
    transactions: Transaction[]; // Array of transactions to visualize
    isLoading: boolean; // Indicates if the data is currently loading
}

// Month abbreviations in English for consistent sorting and processing
const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HomeChart({ transactions, isLoading }: HomeChartProps) {
    const { user } = useUser();
    const theme = useTheme();
    const { t } = useTranslation();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

    // Listen for currency visibility toggle events across the application
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

    // Calculate monthly income and expense totals for the last six months
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
            const transactionDate = fromUTCtoLocal(transaction.date);
            return transactionDate >= sixMonthsAgo && transactionDate <= today;
        });

        // Categorize and sum transactions by month and type (income/expense)
        filteredTransactions.forEach(transaction => {
            const transactionDate = fromUTCtoLocal(transaction.date);
            const monthKey = MONTH_KEYS[transactionDate.getMonth()];

            if (monthlyDataMap[monthKey]) {
                if (transaction.amount > 0) {
                    monthlyDataMap[monthKey].income += transaction.amount;
                } else {
                    monthlyDataMap[monthKey].expenses += Math.abs(transaction.amount);
                }
            }
        });

        // Format data for chart consumption
        const chartData: MonthlyData[] = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = MONTH_KEYS[date.getMonth()];
            // Get localized month name
            const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
            chartData.push({
                month: translatedMonth,
                income: Number(monthlyDataMap[monthKey].income.toFixed(2)),
                expenses: Number(monthlyDataMap[monthKey].expenses.toFixed(2))
            });
        }

        return chartData;
    }, [transactions, isLoading, t]);

    // Update state when memoized data changes
    useEffect(() => {
        setMonthlyData(monthlyDataMemo);
    }, [monthlyDataMemo]);

    // Display skeleton loader while data is loading
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

    // Check if there is any financial data in the selected time period
    const isDataEmpty = monthlyData.length === 0 ||
        monthlyData.every(item => item.income === 0 && item.expenses === 0);

    // Render empty state chart with "no data" message
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
                    {/* Empty chart with zero values */}
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

    // Render chart with financial data
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