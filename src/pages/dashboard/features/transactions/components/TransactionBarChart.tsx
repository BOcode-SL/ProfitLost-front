import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { Fade } from '@mui/material';

import { useUser } from '../../../../../contexts/UserContext';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface TransactionBarChartProps {
    loading: boolean;
    income: number;
    expenses: number;
}

export default function TransactionBarChart({
    loading,
    income,
    expenses
}: TransactionBarChartProps) {
    const { user } = useUser();

    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '100%', md: '300px' }
        }}>
            <Fade in timeout={800}>
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
                        minHeight: 285
                    }}>
                    {loading ? (
                        <Fade in timeout={300}>
                            <Skeleton variant="rectangular" width="100%" height={250} sx={{
                                borderRadius: 3,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </Fade>
                    ) : (
                        <Fade in timeout={500}>
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: ['Monthly Balance'],
                                }]}
                                series={[
                                    {
                                        data: [income],
                                        label: 'Income',
                                        color: '#ff8e38',
                                        valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                                    },
                                    {
                                        data: [expenses],
                                        label: 'Expenses',
                                        color: '#9d300f',
                                        valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
                                    }
                                ]}
                                borderRadius={5}
                                height={250}
                                width={350}
                                margin={{ top: 40, bottom: 40, left: 60, right: 20 }}
                                slotProps={{
                                    legend: { hidden: true }
                                }}
                            />
                        </Fade>
                    )}
                </Paper>
            </Fade>
        </Box>
    );
} 