import { useMemo } from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

import type { Account } from '../../../../../types/models/account.modelTypes';

interface AccountsChartProps {
    accounts: Account[];
    loading: boolean;
    selectedYear: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AccountsChart({ accounts, loading, selectedYear }: AccountsChartProps) {
    const theme = useTheme();

    const chartData = useMemo(() => {
        const dataset = months.map((month) => {
            const monthData: { [key: string]: number | string } = {
                month: month,
            };

            accounts.forEach(account => {
                const monthRecord = account.records.find(
                    record => record.year === selectedYear && record.month === month
                );
                const value = monthRecord?.value || 0;
                monthData[account.accountName] = value;
            });

            return monthData;
        });

        const series = accounts.map(account => ({
            dataKey: account.accountName,
            label: account.accountName,
            color: account.configuration.backgroundColor,
            stack: 'total'
        }));

        return { dataset, series };
    }, [accounts, selectedYear]);

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} />;
    }

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <BarChart
                dataset={chartData.dataset}
                series={chartData.series}
                xAxis={[{
                    data: months,
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
                sx={{
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                        transform: 'translate(-20px, 0)',
                    },
                }}
                height={400}
                margin={{
                    top: 20,
                    right: 30,
                    bottom: 70,
                    left: 70
                }}
                borderRadius={5}
                slotProps={{
                    legend: { hidden: true }
                }}
            />
        </Box>
    );
} 