import { Box } from '@mui/material';

import HomeBalances from './components/HomeBalances';
import HomeChart from './components/HomeChart';
import HomeHistory from './components/HomeHistory';

export default function DashHome() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <HomeBalances income />
                <HomeBalances expenses />
                <HomeBalances savings />
            </Box>
            <HomeChart />
            <HomeHistory />
        </Box>
    );
}