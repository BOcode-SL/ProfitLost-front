import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

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
    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '100%', md: '300px' }
        }}>
            <Paper elevation={2} sx={{
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
                    <Skeleton variant="rectangular" width="100%" height={250} />
                ) : (
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
                            },
                            {
                                data: [expenses],
                                label: 'Expenses',
                                color: '#9d300f',
                            }
                        ]}
                        height={250}
                        width={350}
                        margin={{ top: 40, bottom: 40, left: 60, right: 20 }}
                        slotProps={{
                            legend: { hidden: true }
                        }}
                    />
                )}
            </Paper>
        </Box>
    );
} 