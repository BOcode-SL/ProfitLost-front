/**
 * AccountsChart Module
 * 
 * Provides a visualization component for account balances across months.
 * 
 * Responsibilities:
 * - Renders a bar chart showing monthly balances for all active accounts
 * - Respects currency visibility preferences for user privacy
 * - Adapts to different screen sizes with responsive design
 * - Shows loading skeleton during data fetching
 * - Displays appropriate message when no data is available
 * - Handles formatting of currency values and large numbers
 * 
 * @module AccountsChart
 */
import { useState, useEffect } from 'react';
import { Box, Skeleton, useTheme, Typography, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import {
    CURRENCY_VISIBILITY_EVENT,
    formatCurrency,
    isCurrencyHidden,
    formatLargeNumber
} from '../../../../../utils/currencyUtils';

// Types
import type { Account } from '../../../../../types/supabase/accounts';
import type { YearRecord } from '../../../../../types/supabase/year_records';

/**
 * Extended Account interface that includes year_records relationship
 * 
 * @interface AccountWithYearRecords
 * @extends {Account}
 */
interface AccountWithYearRecords extends Account {
    /** Records of annual financial data for this account */
    year_records?: YearRecord[];
}

/**
 * Interface for the props of the AccountsChart component
 * 
 * @interface AccountsChartProps
 */
interface AccountsChartProps {
    /** Array of account objects with year records */
    accounts: AccountWithYearRecords[];
    
    /** Flag indicating if data is still being loaded */
    loading: boolean;
    
    /** The year for which to display account data */
    selectedYear: number;
}

/**
 * Interface for the data point in chart dataset
 * 
 * @interface DataPoint
 */
interface DataPoint {
    /** Month identifier (e.g., "Jan", "Feb") */
    month: string;
    
    /** Localized month display name */
    monthDisplay: string;
    
    /** Dynamic properties for each account's monthly balance */
    [key: string]: number | string;
}

/** Months in English for backend data mapping */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * AccountsChart Component
 * 
 * Renders a bar chart visualization of account balances across months for a selected year.
 * 
 * @param {AccountsChartProps} props - The component props
 * @param {AccountWithYearRecords[]} props.accounts - Array of account objects with year records
 * @param {boolean} props.loading - Flag indicating if data is still being loaded
 * @param {number} props.selectedYear - The year for which to display account data
 * @returns {JSX.Element} The rendered AccountsChart component
 */
export default function AccountsChart({ accounts, loading, selectedYear }: AccountsChartProps) {
    const { user } = useUser();
    const { t } = useTranslation();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    /**
     * Effect to listen for currency visibility toggle events throughout the app
     * Updates the local state when currency visibility changes
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
     * Gets the localized short month name from translation keys
     * 
     * @param {string} monthKey - The month key to translate
     * @returns {string} The localized month name
     */
    const getMonthShortName = (monthKey: string) => {
        return t(`dashboard.common.monthNamesShort.${monthKey}`);
    };

    // Show skeleton loading placeholder while data is being fetched
    if (loading) {
        return (
            <Box sx={{ width: '100%', height: '100%' }}>
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                        borderRadius: 3,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
            </Box>
        );
    }

    // Filter to get only active accounts for chart display
    const activeAccounts = accounts.filter(account => account.is_active !== false);

    // Check if there is no data available to display
    const isDataEmpty = activeAccounts.length === 0;

    /**
     * Gets month value safely from year record
     * 
     * @param {YearRecord | undefined} yearRecord - The year record to extract value from
     * @param {string} month - The month key to look up
     * @returns {number} The monthly value or 0 if not found
     */
    const getMonthValue = (yearRecord: YearRecord | undefined, month: string): number => {
        if (!yearRecord) return 0;
        const monthKey = month.toLowerCase() as keyof YearRecord;
        const value = yearRecord[monthKey];
        // Handle null values and convert string values to numbers
        return value ? parseFloat(value as string) : 0;
    };

    /**
     * Creates the dataset structure for the chart with month data points
     * Includes each account's monthly values and translated month labels
     */
    const dataset: DataPoint[] = months.map(month => {
        const monthLower = month.toLowerCase();
        const dataPoint: DataPoint = {
            month,
            monthDisplay: getMonthShortName(month)
        };

        // Add each account's monthly value to the data point
        activeAccounts.forEach(account => {
            // Find the year record for this account
            const yearRecords = account.year_records || [];
            const yearRecord = yearRecords.find(record => record.year === selectedYear);
            dataPoint[account.name] = getMonthValue(yearRecord, monthLower);
        });

        return dataPoint;
    });

    /**
     * Configure the series definitions for each account with styling and formatting
     * Each series represents one account in the chart
     */
    const series = activeAccounts.map(account => ({
        dataKey: account.name,
        label: account.name,
        stack: 'total',
        color: account.background_color,
        valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
    }));

    /**
     * Calculates the total balance for a specific month across all accounts
     * 
     * @param {string} month - The month to calculate total for
     * @returns {number} The total balance for the month
     */
    const getMonthTotal = (month: string): number => {
        const monthData = dataset.find(d => d.month === month);
        if (!monthData) return 0;

        const total = activeAccounts.reduce((total, account) => {
            return total + (monthData[account.name] as number || 0);
        }, 0);

        return parseFloat(total.toFixed(2));
    };

    // Return the chart container with conditional empty state message
    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Bar chart component with dynamic dataset and series configuration */}
            <BarChart
                dataset={dataset}
                series={series}
                xAxis={[{
                    dataKey: 'month',
                    scaleType: 'band',
                    // Formatter for x-axis labels with localized month names and totals
                    valueFormatter: (month, context) => {
                        const dataPoint = dataset.find(d => d.month === month);
                        return context.location === 'tick'
                            ? dataPoint?.monthDisplay || month
                            : `${dataPoint?.monthDisplay}: ${formatCurrency(getMonthTotal(month), user)}`;
                    },
                    // Responsive styling for x-axis tick labels
                    tickLabelStyle: {
                        angle: isMobile ? 45 : 0,
                        textAnchor: 'start',
                        fontSize: 12,
                        fill: theme.palette.text.primary
                    }
                }]}
                yAxis={[{
                    // Styling for y-axis tick labels with currency protection
                    tickLabelStyle: {
                        fontSize: 12,
                        fill: theme.palette.text.primary
                    },
                    valueFormatter: (value: number) => formatLargeNumber(value),
                    sx: {
                        text: {
                            filter: isHidden ? 'blur(8px)' : 'none',
                            transition: 'filter 0.3s ease',
                            userSelect: isHidden ? 'none' : 'auto'
                        }
                    }
                }]}
                slotProps={{
                    legend: { hidden: true }
                }}
                tooltip={isHidden ? {
                    trigger: 'none'  // Disable tooltips when currency is hidden
                } : {
                    trigger: 'axis'  // Show tooltips on axis hover when currency is visible
                }}
                borderRadius={5}
                height={400}
                margin={{
                    top: 20,
                    bottom: 70
                }}
            />
            {/* Empty state message overlay when no active accounts exist */}
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
                    {t('dashboard.accounts.chart.noData')}
                </Typography>
            )}
        </Box>
    );
} 