import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

interface PieChartData {
    id: string;
    value: number;
    label: string;
    color: string;
}

interface TransactionPiesProps {
    loading: boolean;
    incomeData: PieChartData[];
    expensesData: PieChartData[];
    totalIncome: number;
    totalExpenses: number;
}

export default function TransactionPies({
    loading,
    incomeData,
    expensesData
}: TransactionPiesProps) {
    return (
        <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            gap: 2,
            flex: 2,
            minWidth: { xs: '100%', md: '600px' }
        }}>
            {/* Income Pie */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: { xs: '45%', md: 300 }
                }}>
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
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={250} />
                    ) : incomeData.length === 0 ? (
                        <p>No data to show</p>
                    ) : (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <PieChart
                                series={[{
                                    data: incomeData,
                                    innerRadius: 0,
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                }]}
                                height={250}
                                width={250}
                                margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                slotProps={{
                                    legend: { hidden: true }
                                }}
                            />
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Expenses Pie */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: { xs: '45%', md: 300 }
                }}>
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
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={250} />
                    ) : expensesData.length === 0 ? (
                        <p>No data to show</p>
                    ) : (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <PieChart
                                series={[{
                                    data: expensesData,
                                    innerRadius: 0,
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                }]}
                                height={250}
                                width={250}
                                margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                slotProps={{
                                    legend: { hidden: true }
                                }}
                            />
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
} 