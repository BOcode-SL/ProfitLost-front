import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';
import './DashboardContent.scss';

const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
    const renderContent = () => {
        switch (activeSection) {
            case 'Annual Report':
                return <AnnualReport />;
            default:
                return <Box>
                    <h4>{activeSection}</h4>
                </Box>;
        }
    };

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
                {renderContent()}
            </Suspense>
        </Box>
    );
};

export default DashboardContent;
