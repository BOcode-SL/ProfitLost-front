/**
 * TransactionPie Module
 * 
 * Renders an interactive pie chart to visualize financial data distribution
 * across different categories with rich interaction features.
 * 
 * Key Features:
 * - Interactive segments with hover highlighting and focus effects
 * - Customizable visualization with configurable colors and labels
 * - Localized currency formatting based on user preferences
 * - Privacy mode with disabled tooltips for sensitive contexts
 * - Progressive loading with animated skeleton placeholders
 * - Empty state handling with appropriate user messaging
 * - Responsive design adapting to various screen dimensions
 * 
 * @module TransactionPie
 */
import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

/**
 * Interface defining pie chart segment data structure
 * 
 * @interface PieChartData
 */
interface PieChartData {
    /** Unique identifier for the segment */
    id: string;
    
    /** Numerical value determining segment size */
    value: number;
    
    /** Display text for the segment in tooltips and legend */
    label: string;
    
    /** Color code for visual representation */
    color: string;
}

/**
 * Props interface for the TransactionPie component
 * 
 * @interface TransactionPieProps
 */
interface TransactionPieProps {
    /** Indicates whether data is still loading */
    loading: boolean;
    
    /** Array of data segments to visualize in the pie chart */
    data: PieChartData[];
}

/**
 * TransactionPie Component
 * 
 * Renders a donut-style pie chart to visualize distribution of financial data
 * across categories, with appropriate loading and empty states.
 * 
 * @param {TransactionPieProps} props - Component properties
 * @returns {JSX.Element} Rendered pie chart component
 */
export default function TransactionPie({
    loading,
    data
}: TransactionPieProps) {
    const { t } = useTranslation();
    const { user } = useUser();

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

    /**
     * Render the chart with appropriate container and responsive layout
     */
    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '45%', md: 300 },
            display: { xs: 'none', sm: 'block' }
        }}>
            <Paper elevation={3} sx={{
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
                {/* Conditional rendering based on loading and data state */}
                {loading ? (
                    // Loading state - animated skeleton placeholder
                    <Skeleton variant="rectangular" width="100%" height={250} sx={{
                        borderRadius: 3,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                ) : data.length === 0 ? (
                    // Empty data state - display guidance message
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
                ) : (
                    // Data available - render interactive pie chart
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PieChart
                            series={[{
                                data,
                                innerRadius: 60,           // Creates donut-style chart
                                paddingAngle: 2,           // Spacing between segments
                                cornerRadius: 4,           // Rounded corners on segments
                                highlightScope: { faded: 'global', highlighted: 'item' }, // Highlight effect
                                valueFormatter: (value: { value: number }) => formatCurrency(value.value, user)
                            }]}
                            height={250}
                            width={250}
                            margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            slotProps={{
                                legend: { hidden: true }   // Hide default legend
                            }}
                            tooltip={isHidden ? {
                                trigger: 'none'            // Disable tooltips in privacy mode
                            } : {
                                trigger: 'item'            // Show tooltips on segment hover
                            }}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
} 