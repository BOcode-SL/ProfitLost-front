import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Paper, Skeleton, Fade, useTheme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/formatCurrency';

// Months
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Interface for the props of the TransactionBarChart component
interface TransactionBarChartProps {
    loading: boolean; // Indicates whether the data is currently loading
    month: string;    // The month for which the data is displayed
    income: number;   // Total income for the specified month
    expenses: number; // Total expenses for the specified month
}

// TransactionBarChart component
export default function TransactionBarChart({
    loading,
    month,
    income,
    expenses
}: TransactionBarChartProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

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

    // Check if the data is empty
    const isDataEmpty = income === 0 && expenses === 0;

    // Function to get the translated month name
    const getMonthName = (month: string) => {
        const monthIndex = parseInt(month) - 1;
        return t(`dashboard.common.monthNames.${months[monthIndex]}`);
    }

    // Return the main container for the chart
    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '100%', md: '300px' }
        }}>
            {/* Fade in effect for the paper component */}
            <Fade in timeout={800}>
                {/* Paper component to hold the chart */}
                <Paper
                    elevation={2}
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
                        // Fade in effect for the skeleton loader
                        <Fade in timeout={300}>
                            {/* Skeleton loader for the chart area */}
                            <Skeleton variant="rectangular" width="100%" height={250} sx={{
                                borderRadius: 3,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </Fade>
                    ) : (
                        // Fade in effect for the chart when not loading
                        <Fade in timeout={500}>
                            {/* Box to contain the chart */}
                            <Box sx={{ width: '100%', position: 'relative' }}>
                                {/* BarChart component to display income and expenses */}
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
                                        left: 60,
                                        right: 20,
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
                                        }
                                    }]}
                                    tooltip={isHidden ? {
                                        trigger: 'none'
                                    } : {
                                        trigger: 'axis'
                                    }}
                                />
                                {/* Display a message if there is no data */}
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
                        </Fade>
                    )}
                </Paper>
            </Fade>
        </Box>
    );
} 