import { Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

const DashHome = lazy(() => import('../features/dashHome/DashHome'));
const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));
const Accounts = lazy(() => import('../features/accounts/Accounts'));
const Notes = lazy(() => import('../features/notes/Notes'));

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
    const renderContent = () => {
        switch (activeSection) {
            case 'Dashboard':
                return <DashHome />;
            case 'Annual Report':
                return <AnnualReport />;
            case 'Transactions':
                return <Transactions />;
            case 'Accounts':
                return <Accounts />;
            case 'Notes':
                return <Notes />;
            default:
                return (
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            bgcolor: 'background.paper',
                            backdropFilter: 'blur(10px)',
                            '& p': {
                                fontSize: '2rem',
                                margin: 0
                            }
                        }}
                    >
                        <p>🚧{activeSection} is under construction🚧</p>
                    </Paper>
                );
        }
    };

    return (
        <Box sx={{
            gridArea: 'Content',
            width: '100%',
            minHeight: 'calc(100vh - 90px)',
            pr: { xs: 0, md: 2 },
            pb: { xs: 0, md: 2 },
            position: 'relative',
            '@media (max-width: 868px)': {
                p: 2,
                mb: '80px',
                flex: 1,
                mt: '80px'
            },
            '& .MuiPaper-root': {
                transition: 'all 0.3s ease',
                '&.scrolled': {
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)'
                }
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
                    <CircularProgress
                        size={48}
                        sx={{
                            color: 'primary.main'
                        }}
                    />
                </Box>
            }>
                {renderContent()}
            </Suspense>
        </Box>
    );
};

export default DashboardContent;
