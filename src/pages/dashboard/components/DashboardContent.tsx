import { Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import './DashboardContent.scss';

const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
    const renderContent = () => {
        switch (activeSection) {
            case 'Annual Report':
                return <AnnualReport />;
            case 'Transactions':
                return <Transactions />;
            default:
                return <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px'
                    }}
                >
                    <p style={{ fontSize: '2rem' }}>🚧{activeSection} is under construction🚧</p>
                </Paper>
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
