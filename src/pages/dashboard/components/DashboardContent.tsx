/**
 * Dashboard Content Module
 * 
 * Provides the main content area for the dashboard with dynamic section loading.
 * 
 * Responsibilities:
 * - Dynamically loads the appropriate feature component based on active section
 * - Manages section introduction dialogs for first-time users
 * - Handles smooth transitions between sections
 * - Provides loading indicators during component loading
 * 
 * @module DashboardContent
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

/**
 * Interface for the props of the DashboardContent component
 * 
 * @interface DashboardContentProps
 */
interface DashboardContentProps {
    /** The currently active section key to display */
    activeSection: string;
}

/**
 * Dashboard Content Component
 * 
 * Main content area that dynamically renders the active dashboard section
 * and manages first-time user introductions for each section.
 * 
 * @param {DashboardContentProps} props - The component props
 * @param {string} props.activeSection - The key of the currently active section
 * @returns {JSX.Element} The rendered DashboardContent component
 */
export default function DashboardContent({ activeSection }: DashboardContentProps) {
    const { user, userPreferences, loadUserData } = useUser();
    const [showIntro, setShowIntro] = useState(false);

    /**
     * Scrolls to the top of the page when section changes
     * Improves user experience when navigating between sections
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSection]);

    /**
     * Shows introduction dialog for sections the user hasn't seen before
     * Only displays if onboarding is complete and the section is new
     */
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

    /**
     * Handles introduction dialog closure and updates user preferences
     * Updates the server with the user's section visibility status
     */
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
 * Displays a centered circular progress indicator while content is loading.
 * Used as a fallback during lazy component loading.
 * 
 * @returns {JSX.Element} The rendered LoadingIndicator component
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
 * Interface for the props of the SectionContent component
 * 
 * @interface SectionContentProps
 */
interface SectionContentProps {
    /** The currently active section key to render */
    activeSection: string;
}

/**
 * Section Content Component
 * 
 * Renders the appropriate feature component based on the active section key.
 * Falls back to an "under construction" message for undefined sections.
 * 
 * @param {SectionContentProps} props - The component props
 * @param {string} props.activeSection - The key of the active section to render
 * @returns {JSX.Element} The rendered section component
 */
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
        default:
            return <UnderConstructionSection name={activeSection} />;
    }
}

/**
 * Interface for the props of the UnderConstructionSection component
 * 
 * @interface UnderConstructionSectionProps
 */
interface UnderConstructionSectionProps {
    /** The name of the section that is under construction */
    name: string;
}

/**
 * Under Construction Section Component
 * 
 * Displays a placeholder for sections that are not yet implemented
 * or if an invalid section name is provided.
 * 
 * @param {UnderConstructionSectionProps} props - The component props
 * @param {string} props.name - The name of the section to display
 * @returns {JSX.Element} The rendered placeholder component
 */
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