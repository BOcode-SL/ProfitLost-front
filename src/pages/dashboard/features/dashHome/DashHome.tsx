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
            <HomeBalances />
            <HomeChart />
            <HomeHistory />
        </Box >
    );
}