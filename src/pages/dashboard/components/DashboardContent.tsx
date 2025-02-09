import { Suspense, lazy } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';

// Components
const DashHome = lazy(() => import('../features/dashHome/DashHome'));
const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));
const Accounts = lazy(() => import('../features/accounts/Accounts'));
// const Goals = lazy(() => import('../features/goals/Goals'));
const Notes = lazy(() => import('../features/notes/Notes'));

// Interface for the props of the DashboardContent component
interface DashboardContentProps {
    activeSection: string; // The currently active section
}

// DashboardContent component
export default function DashboardContent({ activeSection }: DashboardContentProps) {

    // Render the content based on the active section
    const renderContent = () => {
        switch (activeSection) {
            case 'dashhome':
                return <DashHome />;

            case 'annualReport':
                return <AnnualReport />;
            case 'transactions':
                return <Transactions />;
            case 'accounts':
                return <Accounts />;
            case 'notes':
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
                            backdropFilter: 'blur(10px)',
                            '& p': {
                                fontSize: '2rem',
                                margin: 0
                            }
                        }}
                    >
                        <p>🚧 {activeSection} is under construction 🚧</p>
                    </Paper>
                );
        }
    };

    // Main container for the dashboard content
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
                mb: '100px',
                flex: 1,
                mt: '80px'
            }
        }}>
            {/* Suspense component to handle loading state */}
            <Suspense fallback={
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    minHeight: '200px'
                }}>
                    {/* Circular progress indicator for loading state */}
                    <CircularProgress
                        size={48}
                        sx={{
                            color: 'primary.main'
                        }}
                    />
                </Box>
            }>
                {/* Render the content based on the active section */}
                {renderContent()}
            </Suspense>
        </Box>
    );
};