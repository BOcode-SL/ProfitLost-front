import { Suspense, lazy, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import { userService } from '../../../services/user.service';

import SectionIntroDialog from './SectionIntroDialog';

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
    // Initialize user context and state for showing the introduction dialog
    const { user, setUser } = useUser();
    const [showIntro, setShowIntro] = useState(false);

    // Effect to scroll to the top when the active section changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSection]);

    useEffect(() => {
        // Show the introduction dialog only if:
        // 1. The user exists
        // 2. The global onboarding is completed
        // 3. The current section has not been shown yet
        if (user && activeSection && user.onboarding.completed) {
            const sectionIntro = user.onboarding.sections.find(
                section => section.section === activeSection
            );
            
            if (!sectionIntro || !sectionIntro.shown) {
                setShowIntro(true);
            }
        }
    }, [activeSection, user]);

    const handleIntroClose = async () => {
        try {
            // Update the onboarding section in the user service
            await userService.updateOnboardingSection(activeSection);
            if (user) {
                setUser({
                    ...user,
                    onboarding: {
                        ...user.onboarding,
                        sections: [
                            ...user.onboarding.sections.filter(s => s.section !== activeSection),
                            { section: activeSection, shown: true }
                        ]
                    }
                });
            }
        } catch (error) {
            console.error('Error updating onboarding section:', error);
        }
        setShowIntro(false);
    };

    // Function to render the content based on the active section
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
        <Box sx={{ gridArea: 'Content', p: { xs: 2, md: 3 }, pb: { xs: 10, md: 3 } }}>
            <Suspense fallback={
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '50vh'
                }}>
                    <CircularProgress size={48} sx={{ color: 'primary.main' }} />
                </Box>
            }>
                {renderContent()}
            </Suspense>
            {showIntro && (
                <SectionIntroDialog
                    open={showIntro}
                    onClose={handleIntroClose}
                    section={activeSection}
                />
            )}
        </Box>
    );
};