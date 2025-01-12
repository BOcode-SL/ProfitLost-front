import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Fade } from '@mui/material';

interface PieChartData {
    id: string;
    value: number;
    label: string;
    color: string;
}

interface TransactionPieProps {
    loading: boolean;
    data: PieChartData[];
}

export default function TransactionPie({
    loading,
    data
}: TransactionPieProps) {
    return (
        <Box sx={{
            flex: 1,
            minWidth: { xs: '45%', md: 300 },
            display: { xs: 'none', sm: 'block' }
        }}>
            <Fade in timeout={600}>
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
                        <Fade in timeout={300}>
                            <Skeleton variant="rectangular" width="100%" height={250} sx={{ 
                                borderRadius: 3,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </Fade>
                    ) : data.length === 0 ? (
                        <Fade in timeout={300}>
                            <Typography>No data to show</Typography>
                        </Fade>
                    ) : (
                        <Fade in timeout={500}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <PieChart
                                    series={[{
                                        data,
                                        innerRadius: 60,
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
                        </Fade>
                    )}
                </Paper>
            </Fade>
        </Box>
    );
} 