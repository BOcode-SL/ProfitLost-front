/**
 * AnnualChart Component
 * 
 * Displays a monthly breakdown of income and expenses as a bar chart.
 * Features include:
 * - Side-by-side comparison of income vs expenses for each month
 * - Currency formatting based on user preferences
 * - Privacy mode with blurred monetary values
 * - Responsive design for different screen sizes
 * - Empty state handling when no transaction data exists
 * - Loading skeleton while data is being processed
 */
import { useMemo, useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Skeleton, useMediaQuery, useTheme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';

// Utils
import {
    CURRENCY_VISIBILITY_EVENT,
    formatCurrency,
    isCurrencyHidden,
    formatLargeNumber
} from '../../../../../utils/currencyUtils';
import { fromUTCtoLocal } from '../../../../../utils/dateUtils';

// Interface for the props of the AnnualChart component
interface AnnualChartProps {
    transactions: Transaction[]; // Array of transactions to visualize
    isLoading: boolean; // Indicates if the data is currently loading
}

// Month abbreviations in English for consistent sorting and processing
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// AnnualChart component
export default function AnnualChart({ transactions, isLoading }: AnnualChartProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { user } = useUser();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

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

    // Get localized abbreviated month names for chart labels
    const getMonthShortName = (monthKey: string) => {
        return t(`dashboard.common.monthNamesShort.${monthKey}`);
    };

    // Calculate monthly income and expense totals from transaction data
    const chartData = useMemo(() => {
        // Initialize an array with 12 empty month buckets
        const monthsData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expenses: 0
        }));

        // Aggregate transactions by month
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

    // Display loading skeleton while data is being fetched
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

    // Check if there is any data to display
    const isDataEmpty = Object.values(chartData).every(item => item.income === 0 && item.expenses === 0);

    // Main container for the chart
    return (
        <Box sx={{
            width: '100%',
            height: { xs: 300, sm: 350, pt: 1 },
            position: 'relative',
            // Responsive font size for x-axis labels
            '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
            }
        }}>
            {/* Bar chart showing income and expenses for each month */}
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
                    trigger: 'none' // Disable tooltips when privacy mode is active
                } : {
                    trigger: 'axis' // Show tooltips on hover when privacy mode is inactive
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
            {/* Empty state message when no transaction data exists */}
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