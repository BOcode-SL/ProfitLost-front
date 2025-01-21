import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { toast } from 'react-hot-toast';

import { useUser } from '../../../../../contexts/UserContext';
import { transactionService } from '../../../../../services/transaction.service';
import type { Transaction } from '../../../../../types/models/transaction';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
}

export default function HomeChart() {
    const { user } = useUser();
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await transactionService.getAllTransactions();
                if (!response.success) {
                    throw new Error('Failed to fetch transactions');
                }

                const transactions = response.data as Transaction[];
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
                    chartData.push({
                        month: monthKey,
                        income: Number(monthlyDataMap[monthKey].income.toFixed(2)),
                        expenses: Number(monthlyDataMap[monthKey].expenses.toFixed(2))
                    });
                }

                setMonthlyData(chartData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
                toast.error('Error loading chart data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChartData();
    }, []);

    if (isLoading) {
        return (
            <Paper sx={{
                gridArea: 'chart',
                p: 2,
                borderRadius: 3,
                height: { xs: '300px', sm: 'auto' }
            }}>
                <Skeleton width={200} height={24} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 280 }} />
            </Paper>
        );
    }

    const isDataEmpty = monthlyData.length === 0 ||
        monthlyData.every(item => item.income === 0 && item.expenses === 0);

    if (isDataEmpty) {
        return (
            <Paper sx={{
                gridArea: 'chart',
                p: 2,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: { xs: '300px', sm: 'auto' }
            }}>
                <Typography variant="body1" color="text.secondary">
                    No data available for the last 6 months
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{
            gridArea: 'chart',
            p: 2,
            borderRadius: 3
        }}>
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                Last 6 months balances
            </Typography>
            <Box sx={{
                width: '100%',
                height: '280px'
            }}>
                <LineChart
                    series={[
                        {
                            data: monthlyData.map(d => d.income),
                            label: 'Income',
                            color: '#ff8e38',
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user)
                        },
                        {
                            data: monthlyData.map(d => d.expenses),
                            label: 'Expenses',
                            color: '#9d300f',
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