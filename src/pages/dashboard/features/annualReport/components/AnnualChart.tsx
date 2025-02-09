import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Skeleton, useMediaQuery, useTheme, Fade, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Utils
import { formatCurrency } from '../../../../../utils/formatCurrency';

// Interface for the props of the AnnualChart component
interface AnnualChartProps {
    transactions: Transaction[]; // Array of transactions
    loading: boolean; // Loading state
}

// Months in English for the backend
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// AnnualChart component
export default function AnnualChart({ transactions, loading }: AnnualChartProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { user } = useUser();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Function to get the translated month name
    const getMonthShortName = (monthKey: string) => {
        return t(`dashboard.common.monthNamesShort.${monthKey}`);
    };

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

    // If the data is loading, show a skeleton
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

    // If the data is empty, show a message
    const isDataEmpty = chartData.every(item => item.income === 0 && item.expenses === 0);

    // Fade in animation for the chart component
    return (
        <Fade in timeout={500}>
            {/* Main container for the chart */}
            <Box sx={{
                width: '100%',
                height: { xs: 300, sm: 350, pt: 1 },
                position: 'relative',
                // Style for the tick labels on the x-axis
                '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                }
            }}>
                {/* Bar chart component displaying income and expenses */}
                <BarChart
                    series={[
                        {
                            data: chartData.map(item => item.income),
                            label: t('dashboard.annualReport.chart.income'),
                            color: theme.palette.chart.income,
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                        },
                        {
                            data: chartData.map(item => item.expenses),
                            label: t('dashboard.annualReport.chart.expenses'),
                            color: theme.palette.chart.expenses,
                            valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                        }
                    ]}
                    xAxis={[{
                        data: months.map(month => getMonthShortName(month)),
                        scaleType: 'band',
                        tickLabelStyle: {
                            angle: isMobile ? 45 : 0,
                            textAnchor: isMobile ? 'start' : 'middle',
                        }
                    }]}
                    height={isMobile ? 300 : 350}
                    borderRadius={5}
                    margin={{
                        top: 20,
                        left: 60,
                        right: 30,
                        bottom: 30
                    }}
                    slotProps={{
                        legend: { hidden: true }
                    }}
                    sx={{
                        '& .MuiXChart-tooltip': {
                            borderRadius: '8px',
                        }
                    }}
                />
                {/* Display message when there is no data */}
                {isDataEmpty && (
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
                        {t('dashboard.annualReport.chart.noData')}
                    </Typography>
                )}
            </Box>
        </Fade>
    );
}