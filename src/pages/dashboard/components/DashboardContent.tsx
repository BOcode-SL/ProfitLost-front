import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import './DashboardContent.scss';

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
    return (
        <Box className='dashboard__content'>
            <Suspense fallback={
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    minHeight: '200px'
                }}>
                    <CircularProgress size="3rem" />
                </Box>
            }>
                <Box>
                    <h4>{activeSection}</h4>
                </Box>
            </Suspense>
        </Box>
    );
};

export default DashboardContent;
