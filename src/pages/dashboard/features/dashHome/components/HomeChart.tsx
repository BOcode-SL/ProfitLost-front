import { Box, Paper, Typography } from '@mui/material';

export default function HomeChart() {
    return (
        <Paper sx={{
            gridArea: 'chart',
            p: 2,
            borderRadius: 3,
            height: { xs: '300px', sm: 'auto' }
        }}>
            <Typography variant="subtitle1" color="primary.light" gutterBottom>
                Last 6 months balances
            </Typography>
            <Box sx={{
                width: '100%',
                height: { xs: '250px', sm: '300px' }
            }}>
                {/* Chart component will go here */}
            </Box>
        </Paper>
    );
} 