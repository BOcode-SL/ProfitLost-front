/**
 * Dashboard Content Component
 * 
 * Container that manages the content area of the dashboard:
 * - Loads the appropriate feature component based on active section
 * - Manages section introduction dialogs for first-time users
 * - Handles smooth transitions between sections
 * - Provides loading indicators during component loading
 */

import { Suspense, lazy, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';

// Contexts
import { useUser } from '../../../contexts/UserContext';

// Services
import { userService } from '../../../services/user.service';

// Components
import SectionIntroDialog from './SectionIntroDialog';

// Lazy-loaded feature components
const DashHome = lazy(() => import('../features/dashHome/DashHome'));
const AnnualReport = lazy(() => import('../features/annualReport/AnnualReport'));
const Transactions = lazy(() => import('../features/transactions/Transactions'));
const Accounts = lazy(() => import('../features/accounts/Accounts'));
const Notes = lazy(() => import('../features/notes/Notes'));
const NotificationsEditor = lazy(() => import('../features/notifications/editor/NotificationsEditor'));

// Interface for the props of the DashboardContent component
interface DashboardContentProps {
    activeSection: string; // The currently active section to display
}

export default function DashboardContent({ activeSection }: DashboardContentProps) {
    const { user, userPreferences, loadUserData } = useUser();
    const [showIntro, setShowIntro] = useState(false);

    // Scroll to top when section changes for better UX
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSection]);

    // Show introduction dialog for new sections user hasn't seen before
    useEffect(() => {
        if (user && activeSection && userPreferences && userPreferences.onboarding.completed) {
            const sectionIntro = userPreferences.onboarding.sections.find(
                (section) => section.section === activeSection
            );

            if (!sectionIntro || !sectionIntro.shown) {
                setShowIntro(true);
            }
        }
    }, [activeSection, user, userPreferences]);

    // Handle introduction dialog close and update user preferences
    const handleIntroClose = async () => {
        try {
            await userService.updateOnboardingSection(activeSection);
            
            // Refresh the user data to get updated preferences
            await loadUserData();
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

/**
 * Loading Indicator Component
 * 
 * Displays a centered circular progress indicator
 * while the section content is being loaded
 */
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

/**
 * Section Content Component
 * 
 * Renders the appropriate feature component based on the active section
 * Falls back to an "under construction" message for undefined sections
 */
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
        case 'notifications':
            return <NotificationsEditor />;
        default:
            return <UnderConstructionSection name={activeSection} />;
    }
}

/**
 * Under Construction Section Component
 * 
 * Displays a placeholder for sections that are not yet implemented
 * or if an invalid section name is provided
 */
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