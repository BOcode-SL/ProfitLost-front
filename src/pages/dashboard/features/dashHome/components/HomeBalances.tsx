import { Box, Paper, Typography } from '@mui/material';

interface BalanceCardProps {
    type: string;
    index: number;
}

const BalanceCard = ({ type, index }: BalanceCardProps) => (
    <Paper sx={{
        flex: 1,
        p: 2,
        flexDirection: 'column',
        gap: 1,
        borderRadius: 3,
        minHeight: { xs: '120px', sm: 'auto' },
        display: {
            xs: index === 2 ? 'none' : 'flex',
            sm: 'flex'
        }
    }}>
        <Typography variant="subtitle1" color="primary.light">
            {type}
        </Typography>
        <Typography sx={{ fontWeight: '450', fontSize: '1.7rem' }}>
            {index === 0 ? '30,00 €' : index === 1 ? '1.291,29 €' : '-1.261,29 €'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: index === 1 ? '#e8f5e9' : '#ffebee',
                color: index === 1 ? '#2e7d32' : '#d32f2f',
                px: 1,
                py: 0.3,
                borderRadius: 2,
                fontSize: '0.8rem'
            }}>
                <span className="material-symbols-rounded">
                    {index === 1 ? 'trending_up' : 'trending_down'}
                </span>
                {index === 0 ? '-98.5%' : index === 1 ? '-29.5%' : '-1288.4%'}
            </Box>
            <Typography variant="body2" color="text.secondary">
                than last month
            </Typography>
        </Box>
    </Paper>
);

export default function HomeBalances() {
    return (
        <Box sx={{
            gridArea: 'balances',
            display: 'flex',
            gap: '1rem',
            flexDirection: { xs: 'column', sm: 'row' }
        }}>
            {['Earnings', 'Spendings', 'Savings'].map((type, index) => (
                <BalanceCard key={type} type={type} index={index} />
            ))}
        </Box>
    );
} 