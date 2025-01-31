import { Suspense, lazy } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
const DashHome = lazy(() => import('../features/dashHome/DashHome'));
const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));
const Accounts = lazy(() => import('../features/accounts/Accounts'));
// const Goals = lazy(() => import('../features/goals/Goals'));
const Notes = lazy(() => import('../features/notes/Notes'));

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
    const { t } = useTranslation();
    const renderContent = () => {
        switch (activeSection) {
            case t('dashboard.dashhome.title'):
                return <DashHome />;
            case t('dashboard.annualReport.title'):
                return <AnnualReport />;
            case t('dashboard.transactions.title'):
                return <Transactions />;
            case t('dashboard.accounts.title'):
                return <Accounts />;
            // case t('dashboard.goals.title'):
            //     return <Goals />;
            case t('dashboard.notes.title'):
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
