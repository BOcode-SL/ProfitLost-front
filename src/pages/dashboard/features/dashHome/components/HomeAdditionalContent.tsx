import { Box, Paper, Typography } from '@mui/material';

interface HomeAdditionalContentProps {
    area: string;
}

export default function HomeAdditionalContent({ area }: HomeAdditionalContentProps) {
    return (
        <Box sx={{
            gridArea: area,
            display: { xs: 'none', sm: area === 'categories' ? 'none' : 'block', md: 'block' }
        }}>
            <Paper sx={{
                p: 2,
                height: '100%',
                borderRadius: 3
            }}>
                <Typography variant="subtitle1" color="primary.light">
                    {area === 'first' ? 'Additional Content 1' :
                     area === 'second' ? 'Categories - gasto' :
                     'Categories + gasto'}
                </Typography>
            </Paper>
        </Box>
    );
} 