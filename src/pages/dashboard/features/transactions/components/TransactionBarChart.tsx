import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Paper, Skeleton, Fade, useTheme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../../../contexts/UserContext';
import { formatCurrency } from '../../../../../utils/formatCurrency';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface TransactionBarChartProps {
    loading: boolean;
    month: string;
    income: number;
    expenses: number;
}

export default function TransactionBarChart({
    loading,
    month,
    income,
    expenses
}: TransactionBarChartProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    const isDataEmpty = income === 0 && expenses === 0;

    // Función para obtener el nombre traducido del mes
    const getMonthName = (month: string) => {
        const monthIndex = parseInt(month) - 1;
        return t(`dashboard.common.monthNames.${months[monthIndex]}`);
    }

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
                        minHeight: 285,
                        position: 'relative'
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
                            <Box sx={{ width: '100%', position: 'relative' }}>
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
                                />
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