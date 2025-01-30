import { Box, Skeleton, useTheme, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

import { useUser } from '../../../../../contexts/UserContext';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { Account } from '../../../../../types/models/account';

interface AccountsChartProps {
    accounts: Account[];
    loading: boolean;
    selectedYear: number;
}

interface DataPoint {
    month: string;
    [key: string]: number | string;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AccountsChart({ accounts, loading, selectedYear }: AccountsChartProps) {
    const theme = useTheme();
    const { user } = useUser();

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} />;
    }

    const activeAccounts = accounts.filter(account => account.configuration.isActive !== false);
    const isDataEmpty = activeAccounts.length === 0;

    const dataset: DataPoint[] = months.map(month => {
        const dataPoint: DataPoint = { month };
        activeAccounts.forEach(account => {
            const record = account.records.find(r => r.year === selectedYear && r.month === month);
            dataPoint[account.accountName] = record?.value || 0;
        });
        return dataPoint;
    });

    const series = activeAccounts.map(account => ({
        dataKey: account.accountName,
        label: account.accountName,
        stack: 'total',
        color: account.configuration.backgroundColor,
        valueFormatter: (value: number | null) => formatCurrency(value || 0, user),
    }));

    const getMonthTotal = (month: string): number => {
        const monthData = dataset.find(d => d.month === month);
        if (!monthData) return 0;

        const total = activeAccounts.reduce((total, account) => {
            return total + (monthData[account.accountName] as number || 0);
        }, 0);

        return parseFloat(total.toFixed(2));
    };

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <BarChart
                dataset={dataset}
                series={series}
                xAxis={[{
                    dataKey: 'month',
                    scaleType: 'band',
                    valueFormatter: (month, context) =>
                        context.location === 'tick'
                            ? month
                            : `${month}: ${formatCurrency(getMonthTotal(month), user)}`,
                    tickLabelStyle: {
                        angle: 45,
                        textAnchor: 'start',
                        fontSize: 12,
                        fill: theme.palette.text.primary
                    }
                }]}
                yAxis={[{
                    tickLabelStyle: {
                        fontSize: 12,
                        fill: theme.palette.text.primary
                    }
                }]}
                slotProps={{
                    legend: { hidden: true }
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
                    No data available
                </Typography>
            )}
        </Box>
    );
} 