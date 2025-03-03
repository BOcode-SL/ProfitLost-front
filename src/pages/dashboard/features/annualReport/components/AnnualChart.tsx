import { useMemo, useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Skeleton, useMediaQuery, useTheme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Utils
import { CURRENCY_VISIBILITY_EVENT, formatCurrency, isCurrencyHidden, formatLargeNumber } from '../../../../../utils/currencyUtils';
import { fromUTCtoLocal } from '../../../../../utils/dateUtils';

// Interface for the props of the AnnualChart component
interface AnnualChartProps {
    transactions: Transaction[]; // Array of transactions
    isLoading: boolean; // Indicates if the data is currently loading
}

// Months in English for the backend
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// AnnualChart component
export default function AnnualChart({ transactions, isLoading }: AnnualChartProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { user } = useUser();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

    // Function to get the translated short name of the month
    const getMonthShortName = (monthKey: string) => {
        return t(`dashboard.common.monthNamesShort.${monthKey}`);
    };

    // Process transactions data for the chart
    const chartData = useMemo(() => {
        const monthsData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expenses: 0
        }));

        transactions.forEach(transaction => {
            const month = fromUTCtoLocal(transaction.date).getMonth();
            if (transaction.amount > 0) {
                monthsData[month].income += transaction.amount;
            } else {
                monthsData[month].expenses += Math.abs(transaction.amount);
            }
        });

        return monthsData;
    }, [transactions]);

    // If the data is loading, show a skeleton
    if (isLoading) {
        return (
            <Box sx={{ width: '100%', height: { xs: 300, sm: 350 }, borderRadius: 5, p: 1 }}>
                <Skeleton variant="rectangular" width="100%" height="100%"
                    sx={{
                        borderRadius: 3,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
            </Box>
        );
    }

    // Check if the data is empty and show a message if it is
    const isDataEmpty = Object.values(chartData).every(item => item.income === 0 && item.expenses === 0);

    // Main container for the chart
    return (
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
                        data: Object.values(chartData).map(item => item.income),
                        label: t('dashboard.annualReport.chart.income'),
                        color: theme.palette.chart.income,
                        valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                    },
                    {
                        data: Object.values(chartData).map(item => item.expenses),
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
                    bottom: 30
                }}
                slotProps={{
                    legend: { hidden: true }
                }}
                tooltip={isHidden ? {
                    trigger: 'none'
                } : {
                    trigger: 'axis'
                }}
                sx={{
                    '& .MuiXChart-tooltip': {
                        borderRadius: '8px',
                    }
                }}
                yAxis={[{
                    sx: {
                        text: {
                            filter: isHidden ? 'blur(8px)' : 'none',
                            transition: 'filter 0.3s ease',
                            userSelect: isHidden ? 'none' : 'auto'
                        }
                    },
                    valueFormatter: (value: number) => formatLargeNumber(value)
                }]}
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
    );
}