import { Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));
const Accounts = lazy(() => import('../features/accounts/Accounts'));

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
            case 'Accounts':
                return <Accounts />;
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
        <Box sx={{
            gridArea: 'Content',
            width: '100%',
            minHeight: 'calc(100vh - 90px)',
            paddingRight: '1rem',
            paddingBottom: '1rem',
            '@media (max-width: 868px)': {
                padding: '1rem',
                marginBottom: '80px',
                flex: 1,
                marginTop: '80px'
            }
        }}>
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
