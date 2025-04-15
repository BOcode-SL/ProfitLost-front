/**
 * TransactionBarChart Module
 * 
 * Provides a visual comparison of monthly income and expenses through
 * an interactive bar chart with accessibility and privacy features.
 * 
 * Key Features:
 * - Side-by-side comparison of income and expenses with distinct colors
 * - Localized currency formatting based on user preferences
 * - Privacy mode with blurred monetary values and disabled tooltips
 * - Progressive loading with animated skeleton placeholders
 * - Empty state handling with appropriate messaging
 * - Responsive layout adapting to various screen sizes
 * - Localized month names based on user language
 * 
 * @module TransactionBarChart
 */
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Paper, Skeleton, useTheme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import {
    formatCurrency,
    isCurrencyHidden,
    CURRENCY_VISIBILITY_EVENT,
    formatLargeNumber
} from '../../../../../utils/currencyUtils';

/**
 * Standard month abbreviations in English
 * Used for consistent data processing and localization
 */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Props interface for the TransactionBarChart component
 * 
 * @interface TransactionBarChartProps
 */
interface TransactionBarChartProps {
    /** Indicates whether the chart data is currently loading */
    loading: boolean;
    
    /** The month number (1-12) for which to display data */
    month: string;
    
    /** Total income amount for the specified month */
    income: number;
    
    /** Total expenses amount for the specified month */
    expenses: number;
}

/**
 * TransactionBarChart Component
 * 
 * Renders a bar chart comparing income and expenses for a specific month
 * with appropriate loading states and empty data handling.
 * 
 * @param {TransactionBarChartProps} props - Component properties
 * @returns {JSX.Element} Rendered bar chart component
 */
export default function TransactionBarChart({
    loading,
    month,
    income,
    expenses
}: TransactionBarChartProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    /** State tracking whether currency values should be blurred for privacy */
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

    /** Flag indicating whether no financial data exists for the month */
    const isDataEmpty = income === 0 && expenses === 0;

    /**
     * Converts numeric month to localized month name
     * 
     * @param {string} month - Month number (1-12) as string
     * @returns {string} Localized month name
     */
    const getMonthName = (month: string) => {
        const monthIndex = parseInt(month) - 1;
        return t(`dashboard.common.monthNames.${months[monthIndex]}`);
    }

    /**
     * Render the chart with appropriate container and responsive layout
     */
    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '100%', md: '300px' }
        }}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    minHeight: 285,
                    position: 'relative'
                }}>
                {/* Conditional rendering based on loading state */}
                {loading ? (
                    // Loading skeleton with animation
                    <Skeleton variant="rectangular" width="100%" height={250} sx={{
                        borderRadius: 3,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                ) : (
                    // Render chart with actual data or empty state
                    <Box sx={{ width: '100%', position: 'relative' }}>
                        {/* Bar chart comparing income and expenses */}
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: [getMonthName(month)],
                            }]}
                            series={[
                                {
                                    data: [income],
                                    label: t('dashboard.transactions.chart.income'),
                                    color: theme.palette.chart.income,
                                    valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                                },
                                {
                                    data: [expenses],
                                    label: t('dashboard.transactions.chart.expenses'),
                                    color: theme.palette.chart.expenses,
                                    valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                                }
                            ]}
                            borderRadius={5}
                            height={250}
                            margin={{
                                top: 20,
                                bottom: 20
                            }}
                            slotProps={{
                                legend: { hidden: true }
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
                            tooltip={isHidden ? {
                                trigger: 'none' // Disable tooltips in privacy mode
                            } : {
                                trigger: 'axis' // Show tooltips on hover
                            }}
                        />
                        {/* Empty state overlay message */}
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
                                {t('dashboard.common.noData')}
                            </Typography>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
} 