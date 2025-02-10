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
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/formatCurrency';

// Interface for the props of the HomeChart component
interface HomeChartProps {
    transactions: Transaction[]; // Array of transactions
    isLoading: boolean; // Indicates if the data is currently loading
}

// HomeChart component
export default function HomeChart({ transactions, isLoading }: HomeChartProps) {
    const { user } = useUser();
    const theme = useTheme();
    const { t } = useTranslation();
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

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

    // Calculate monthly data based on transactions
    const monthlyDataMemo = useMemo(() => {
        if (isLoading || transactions.length === 0) return [];

        const today = new Date();
        const monthlyDataMap: { [key: string]: { income: number; expenses: number } } = {};

        // Initialize monthly data for the last six months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            monthlyDataMap[monthKey] = { income: 0, expenses: 0 };
        }

        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Filter transactions within the last six months
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= sixMonthsAgo && transactionDate <= today;
        });

        // Aggregate income and expenses for each month
        filteredTransactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const monthKey = transactionDate.toLocaleString('default', { month: 'short' });

            if (monthlyDataMap[monthKey]) {
                if (transaction.amount > 0) {
                    monthlyDataMap[monthKey].income += transaction.amount;
                } else {
                    monthlyDataMap[monthKey].expenses += Math.abs(transaction.amount);
                }
            }
        });

        const chartData: MonthlyData[] = [];
        // Prepare data for the chart
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
            chartData.push({
                month: translatedMonth,
                income: Number(monthlyDataMap[monthKey].income.toFixed(2)),
                expenses: Number(monthlyDataMap[monthKey].expenses.toFixed(2))
            });
        }

        return chartData;
    }, [transactions, isLoading, t]);

    // Update monthly data when memoized data changes
    useEffect(() => {
        setMonthlyData(monthlyDataMemo);
    }, [monthlyDataMemo]);

    // Show skeleton while loading transactions
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

    // Check if the monthly data is empty
    const isDataEmpty = monthlyData.length === 0 ||
        monthlyData.every(item => item.income === 0 && item.expenses === 0);

    // Show message if there is no data
    if (isDataEmpty) {
        const today = new Date();
        const emptyMonths = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            const translatedMonth = t(`dashboard.common.monthNamesShort.${monthKey}`);
            emptyMonths.push(translatedMonth);
        }
        // Container for the empty chart
        return (
            <Paper
                elevation={3}
                sx={{
                    gridArea: 'chart',
                    p: 2,
                    borderRadius: 3
                }}>
                {/* Title of the chart */}
                <Typography variant="subtitle1" color="primary.light" gutterBottom>
                    {t('dashboard.transactions.chart.monthlyBalance')}
                </Typography>
                {/* Box containing the LineChart and no data message */}
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '280px'
                }}>
                    {/* LineChart displaying zero data for income and expenses */}
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
                            }
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
                            trigger: 'none'
                        } : {
                            trigger: 'axis'
                        }}
                    />
                    {/* Message displayed when there is no data */}
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

    // Container for the chart
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
            {/* Box containing the LineChart */}
            <Box sx={{
                width: '100%',
                height: '280px'
            }}>
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
                        }
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
                        trigger: 'none'
                    } : {
                        trigger: 'axis'
                    }}
                />
            </Box>
        </Paper>
    );
}