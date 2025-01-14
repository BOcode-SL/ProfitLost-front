import { Box, Skeleton, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
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

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} />;
    }

    const dataset: DataPoint[] = months.map(month => {
        const dataPoint: DataPoint = { month };
        accounts.forEach(account => {
            const record = account.records.find(r => r.year === selectedYear && r.month === month);
            dataPoint[account.accountName] = record?.value || 0;
        });
        return dataPoint;
    });

    const series = accounts.map(account => ({
        dataKey: account.accountName,
        label: account.accountName,
        stack: 'total',
        color: account.configuration.backgroundColor,
        valueFormatter: (value: number | null) => `$${(value || 0).toFixed(2)}`,
    }));

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <BarChart
                dataset={dataset}
                series={series}
                xAxis={[{
                    dataKey: 'month',
                    scaleType: 'band',
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
                    right: 30,
                    bottom: 70,
                    left: 70
                }}
            />
        </Box>
    );
} 