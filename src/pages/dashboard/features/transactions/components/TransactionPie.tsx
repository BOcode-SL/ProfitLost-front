import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Paper, Skeleton, Typography, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/formatCurrency';

// Types
interface PieChartData {
    id: string;
    value: number;
    label: string;
    color: string;
}

// Interface for the TransactionPie component props
interface TransactionPieProps {
    loading: boolean; // Indicates whether the data is still loading
    data: PieChartData[]; // Array of data for the pie chart
}

// TransactionPie component
export default function TransactionPie({
    loading,
    data
}: TransactionPieProps) {
    const { t } = useTranslation();
    const { user } = useUser();

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

    // Create a Box component to hold the pie chart
    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '45%', md: 300 },
            display: { xs: 'none', sm: 'block' }
        }}>
            {/* Fade in effect for the Paper component */}
            <Fade in timeout={600}>
                {/* Paper component to contain the chart and loading state */}
                <Paper elevation={2} sx={{
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    position: 'relative',
                    height: 285
                }}>
                    {/* Check if loading is true */}
                    {loading ? (
                        // Fade in effect for the Skeleton loading state
                        <Fade in timeout={300}>
                            {/* Skeleton component to indicate loading state */}
                            <Skeleton variant="rectangular" width="100%" height={250} sx={{
                                borderRadius: 3,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </Fade>
                    ) : data.length === 0 ? (
                        // Fade in effect for the no data message
                        <Fade in timeout={300}>
                            {/* Typography component to display a message when there's no data */}
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
                        </Fade>
                    ) : (
                        // Fade in effect for the PieChart when data is available
                        <Fade in timeout={500}>
                            {/* Box to center the PieChart */}
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* PieChart component to visualize the data */}
                                <PieChart
                                    series={[{
                                        data,
                                        innerRadius: 60,
                                        paddingAngle: 2,
                                        cornerRadius: 4,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        valueFormatter: (value: { value: number }) => formatCurrency(value.value, user)
                                    }]}
                                    height={250}
                                    width={250}
                                    margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    slotProps={{
                                        legend: { hidden: true }
                                    }}
                                    tooltip={isHidden ? {
                                        trigger: 'none'
                                    } : {
                                        trigger: 'item'
                                    }}
                                />
                            </Box>
                        </Fade>
                    )}
                </Paper>
            </Fade>
        </Box>
    );
} 