import { Suspense, lazy, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';

// Contexts
import { useUser } from '../../../contexts/UserContext';

// Services
import { userService } from '../../../services/user.service';

// Components
import SectionIntroDialog from './SectionIntroDialog';

// Components
const DashHome = lazy(() => import('../features/dashHome/DashHome'));
const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));
const Accounts = lazy(() => import('../features/accounts/Accounts'));
// const Goals = lazy(() => import('../features/goals/Goals'));
const Notes = lazy(() => import('../features/notes/Notes'));
const Analytics = lazy(() => import('../features/analytics/Analytics'));
const NotificationsEditor = lazy(() => import('../features/notifications/editor/NotificationsEditor'));

// Interface for the props of the DashboardContent component
interface DashboardContentProps {
    activeSection: string; // The currently active section
}

export default function DashboardContent({ activeSection }: DashboardContentProps) {
    const { user, setUser } = useUser();
    const [showIntro, setShowIntro] = useState(false);

    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSection]);

    // Show introduction dialog for new sections
    useEffect(() => {
        if (user && activeSection && user.onboarding.completed) {
            const sectionIntro = user.onboarding.sections.find(
                section => section.section === activeSection
            );

            if (!sectionIntro || !sectionIntro.shown) {
                setShowIntro(true);
            }
        }
    }, [activeSection, user]);

    // Handle introduction dialog close
    const handleIntroClose = async () => {
        try {
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

    return (
        <Box sx={{
            gridArea: 'Content',
            p: { xs: 2, md: 2 },
            pt: { xs: 11, md: 0 },
            pb: { xs: 14, md: 2 },
            pl: { xs: 2, md: 0 },
            width: '100%'
        }}>
            <Suspense fallback={<LoadingIndicator />}>
                <SectionContent activeSection={activeSection} />
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
}

// Loading indicator component
function LoadingIndicator() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
        }}>
            <CircularProgress size={48} sx={{ color: 'primary.main' }} />
        </Box>
    );
}

// Section content component
interface SectionContentProps {
    activeSection: string;
}

function SectionContent({ activeSection }: SectionContentProps) {
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
        case 'analytics':
            return <Analytics />;
        case 'notifications':
            return <NotificationsEditor />;
        default:
            return <UnderConstructionSection name={activeSection} />;
    }
}

// Under construction section component
interface UnderConstructionSectionProps {
    name: string;
}

function UnderConstructionSection({ name }: UnderConstructionSectionProps) {
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
            <p>🚧 {name} is under construction 🚧</p>
        </Paper>
    );
}