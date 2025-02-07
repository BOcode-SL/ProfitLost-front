import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, Skeleton, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../../contexts/UserContext';
import type { Transaction } from '../../../../../types/models/transaction';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
}

interface HomeChartProps {
    transactions: Transaction[];
    isLoading: boolean;
}

export default function HomeChart({ transactions, isLoading }: HomeChartProps) {
    const { user } = useUser();
    const theme = useTheme();
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const { t } = useTranslation();

    const monthlyDataMemo = useMemo(() => {
        if (isLoading || transactions.length === 0) return [];

        const today = new Date();
        const monthlyDataMap: { [key: string]: { income: number; expenses: number } } = {};

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            monthlyDataMap[monthKey] = { income: 0, expenses: 0 };
        }

        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= sixMonthsAgo && transactionDate <= today;
        });

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

    useEffect(() => {
        setMonthlyData(monthlyDataMemo);
    }, [monthlyDataMemo]);

    if (isLoading) {
        return (
            <Paper
                elevation={3}
                sx={{
                    gridArea: 'chart',
                    p: 2,
                    borderRadius: 3,
                    height: { xs: 'auto', sm: 'auto' }
                }}>
                <Skeleton width="100%" height="100%" sx={{ mb: 2 }} /> 
                <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 270 }} />
            </Paper>
        );
    }

    const isDataEmpty = monthlyData.length === 0 ||
        monthlyData.every(item => item.income === 0 && item.expenses === 0);

    if (isDataEmpty) {
        const today = new Date();
        const emptyMonths = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short' });
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
                <Typography variant="subtitle1" color="primary.light" gutterBottom>
                    {t('dashboard.transactions.chart.monthlyBalance')}
                </Typography>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '280px'
                }}>
                    <LineChart
                        series={[
                            {
                                data: [0, 0, 0, 0, 0, 0],
                                label: t('dashboard.transactions.chart.income'),
                                color: theme.palette.chart.income,
                                valueFormatter: (value: number | null) => formatCurrency(value || 0, user)
                            },
                            {
                                data: [0, 0, 0, 0, 0, 0],
                                label: t('dashboard.transactions.chart.expenses'),
                                color: theme.palette.chart.expenses,
                                valueFormatter: (value: number | null) => formatCurrency(value || 0, user)
                            }
                        ]}
                        xAxis={[{
                            data: emptyMonths,
                            scaleType: 'point'
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
                    />
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

    return (
        <Paper
            elevation={3}
            sx={{
                gridArea: 'chart',
                p: 2,
                borderRadius: 3
            }}>
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                {t('dashboard.dashhome.chart.last6MonthsBalance')}
            </Typography>
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
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user)
                        },
                        {
                            data: monthlyData.map(d => d.expenses),
                            label: t('dashboard.transactions.chart.expenses'),
                            color: theme.palette.chart.expenses,
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user)
                        }
                    ]}
                    xAxis={[{
                        data: monthlyData.map(d => d.month),
                        scaleType: 'point'
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
                />
            </Box>
        </Paper>
    );
} 