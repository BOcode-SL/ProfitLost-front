import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { Transaction } from '../../../../../types/models/transaction.modelTypes';
import { Fade } from '@mui/material';

interface AnnualChartProps {
    transactions: Transaction[];
    loading: boolean;
}

export default function AnnualChart({ transactions, loading }: AnnualChartProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const chartData = useMemo(() => {
        const monthsData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expenses: 0
        }));

        transactions.forEach(transaction => {
            const month = new Date(transaction.date).getMonth();
            if (transaction.amount > 0) {
                monthsData[month].income += transaction.amount;
            } else {
                monthsData[month].expenses += Math.abs(transaction.amount);
            }
        });

        return monthsData;
    }, [transactions]);

    if (loading) {
        return (
            <Fade in timeout={300}>
                <Box sx={{ width: '100%', height: { xs: 300, sm: 350 }, borderRadius: 5, p: 1 }}>
                    <Skeleton variant="rectangular" width="100%" height="100%"
                        sx={{
                            borderRadius: 3,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in timeout={500}>
            <Box sx={{
                width: '100%',
                height: { xs: 300, sm: 350, pt: 1 },
                '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                }
            }}>
                <BarChart
                    series={[
                        {
                            data: chartData.map(item => item.income),
                            label: 'Income',
                            color: '#ff8e38',
                        },
                        {
                            data: chartData.map(item => item.expenses),
                            label: 'Expenses',
                            color: '#9d300f',
                        }
                    ]}
                    xAxis={[{
                        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        scaleType: 'band',
                        tickLabelStyle: {
                            angle: isMobile ? 45 : 0,
                            textAnchor: isMobile ? 'start' : 'middle',
                        }
                    }]}
                    height={isMobile ? 300 : 350}
                    borderRadius={5}
                    margin={{
                        left: 60,
                        right: 20,
                        bottom: 35
                    }}
                    sx={{
                        '& .MuiXChart-tooltip': {
                            borderRadius: '8px',
                        }
                    }}
                />
            </Box>
        </Fade>
    );
}