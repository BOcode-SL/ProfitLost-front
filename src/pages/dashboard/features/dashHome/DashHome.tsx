import { Box } from '@mui/material';

import HomeBalances from './components/HomeBalances';
import HomeChart from './components/HomeChart';
import HomeHistory from './components/HomeHistory';

export default function DashHome() {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(6, 1fr)'
            },
            gridTemplateRows: {
                xs: 'auto auto auto auto auto',
                sm: 'auto auto auto auto',
                md: '0.6fr 1.6fr 1.6fr'
            },
            gap: '1rem',
            gridTemplateAreas: {
                xs: `
                    "balances"
                    "chart"
                    "history"
                    "first"
                    "second"
                    "categories"
                `,
                sm: `
                    "balances balances"
                    "chart chart"
                    "history history"
                    "first second"
                    "categories categories"
                `,
                md: `
                    "balances balances balances balances history history"
                    "chart chart chart chart history history"
                    "first first second second categories categories"
                `
            }
        }}>
            <HomeBalances />
            <HomeChart />
            <HomeHistory />
        </Box>
    );
}