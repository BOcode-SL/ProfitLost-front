import { useState, useEffect } from 'react';
import { Box, Skeleton, useTheme, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { CURRENCY_VISIBILITY_EVENT, formatCurrency, isCurrencyHidden } from '../../../../../utils/formatCurrency';

// Types
import type { Account, YearRecord } from '../../../../../types/models/account';

// Interface for the props of the AccountsChart component
interface AccountsChartProps {
    accounts: Account[];
    loading: boolean;
    selectedYear: number;
}

// Interface for the data point
interface DataPoint {
    month: string;
    monthDisplay: string;
    [key: string]: number | string;
}

// Months in English for the backend
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AccountsChart({ accounts, loading, selectedYear }: AccountsChartProps) {
    const { user } = useUser();
    const { t } = useTranslation();
    const theme = useTheme();

    // State to track currency visibility
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    // Effect to listen for changes in currency visibility
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

    // Function to get the short translated name of the month
    const getMonthShortName = (monthKey: string) => {
        return t(`dashboard.common.monthNamesShort.${monthKey}`);
    };

    // Show skeleton loading while data is being fetched
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

    // Filter to get only active accounts
    const activeAccounts = accounts.filter(account => account.configuration.isActive !== false);

    // Check if there is no data available
    const isDataEmpty = activeAccounts.length === 0;

    // Create the dataset for the chart
    const dataset: DataPoint[] = months.map(month => {
        const monthLower = month.toLowerCase();
        const dataPoint: DataPoint = {
            month,
            monthDisplay: getMonthShortName(month)
        };

        activeAccounts.forEach(account => {
            const yearRecord = account.records[selectedYear.toString()];
            dataPoint[account.accountName] = yearRecord ? yearRecord[monthLower as keyof YearRecord] : 0;
        });

        return dataPoint;
    });

    // Create the series for the chart
    const series = activeAccounts.map(account => ({
        dataKey: account.accountName,
        label: account.accountName,
        stack: 'total',
        color: account.configuration.backgroundColor,
        valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
    }));

    // Function to calculate the total for a specific month
    const getMonthTotal = (month: string): number => {
        const monthData = dataset.find(d => d.month === month);
        if (!monthData) return 0;

        const total = activeAccounts.reduce((total, account) => {
            return total + (monthData[account.accountName] as number || 0);
        }, 0);

        return parseFloat(total.toFixed(2));
    };

    // Container for the chart
    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Bar chart component with dataset and series */}
            <BarChart
                dataset={dataset}
                series={series}
                xAxis={[{
                    dataKey: 'month',
                    scaleType: 'band',
                    // Formatter for the x-axis labels
                    valueFormatter: (month, context) => {
                        const dataPoint = dataset.find(d => d.month === month);
                        return context.location === 'tick'
                            ? dataPoint?.monthDisplay || month
                            : `${dataPoint?.monthDisplay}: ${formatCurrency(getMonthTotal(month), user)}`;
                    },
                    // Style for the tick labels on the x-axis
                    tickLabelStyle: {
                        angle: 45,
                        textAnchor: 'start',
                        fontSize: 12,
                        fill: theme.palette.text.primary
                    }
                }]}
                yAxis={[{
                    // Style for the tick labels on the y-axis
                    tickLabelStyle: {
                        fontSize: 12,
                        fill: theme.palette.text.primary
                    },
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
                    trigger: 'none'
                } : {
                    trigger: 'axis'
                }}
                borderRadius={5}
                height={400}
                margin={{
                    top: 20,
                    left: 60,
                    right: 20,
                    bottom: 70
                }}
            />
            {/* Display message when there is no data available */}
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