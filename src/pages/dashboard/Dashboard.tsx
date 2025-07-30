/**
 * Dashboard Module
 *
 * Main application container that serves as the primary layout after user authentication.
 *
 * Responsibilities:
 * - Manages navigation between different application sections
 * - Verifies user authentication state and redirects if necessary
 * - Handles onboarding process for new users
 * - Provides transaction creation workflow
 * - Structures global layout (header, navigation, content areas)
 *
 * @module Dashboard
 */

import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Contexts
import { useUser } from "../../contexts/UserContext";

// Components
import DashboardHeader from "./components/DashboardHeader";
import DashboardNav from "./components/DashboardNav";
import DashboardContent from "./components/DashboardContent";
import GlobalOnboardingDialog from "./components/GlobalOnboardingDialog";
import LoadingScreen from "./components/LoadingScreen";
import TransactionForm from "./features/transactions/components/TransactionForm";
import DrawerBase from "./components/ui/DrawerBase";

// Utils
import { dispatchTransactionUpdated } from "../../utils/events";

/**
 * Dashboard Component
 *
 * Provides the main structure and functionality for the authenticated user experience.
 *
 * @returns {JSX.Element} The rendered Dashboard component
 */
export default function Dashboard() {
  const { t } = useTranslation();
  const { user, isLoading, userPreferences, userRole } =
    useUser();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("dashhome");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);

  /**
   * Redirects unauthenticated users to the authentication page
   */
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  /**
   * Manages the visibility of the onboarding dialog for new users
   * Checks user preferences to determine if onboarding should be shown
   */
  useEffect(() => {
    // Check if onboarding data exists in user's preferences from context
    const onboardingCompleted = userPreferences?.onboarding?.completed || false;

    const shouldShowOnboarding = user && !onboardingCompleted;

    if (shouldShowOnboarding) {
      setShowOnboarding(true);

      // Clear section parameters while onboarding is active
      const section = searchParams.get("section");
      if (section) {
        setSearchParams({});
      }
      setActiveSection("dashhome");
    }
  }, [user, userPreferences, searchParams, setSearchParams]);

  /**
   * Synchronizes the active section with URL parameters
   */
  useEffect(() => {
    const section = searchParams.get("section");
    setActiveSection(section || "dashhome");
  }, [searchParams]);

  /**
   * Constructs menu items with translations for the navigation
   */
  const menuItems = useMemo(
    () => [
      { label: t("dashboard.dashhome.title"), icon: "home", key: "dashhome" },
      {
        label: t("dashboard.annualReport.title"),
        icon: "bar_chart_4_bars",
        key: "annualReport",
      },
      {
        label: t("dashboard.transactions.title"),
        icon: "receipt_long",
        key: "transactions",
      },
      {
        label: t("dashboard.accounts.title"),
        icon: "account_balance",
        key: "accounts",
      },
      { label: t("dashboard.notes.title"), icon: "note_alt", key: "notes" },
    ],
    [t]
  );

  /**
   * Handles navigation to a different section
   *
   * @param {string} sectionKey - The key of the section to navigate to
   */
  const handleMenuItemClick = (sectionKey: string) => {
    setActiveSection(sectionKey);
    setSearchParams(sectionKey === "dashhome" ? {} : { section: sectionKey });
  };

  /**
   * Handles the completion of the onboarding process
   */
  const handleOnboardingClose = () => {
    localStorage.removeItem("onboarding_progress");
    setShowOnboarding(false);
  };

  /**
   * Opens the transaction creation drawer
   */
  const handleAddTransaction = () => {
    setTransactionDrawerOpen(true);
  };

  /**
   * Closes the transaction creation drawer
   */
  const handleTransactionDrawerClose = () => {
    setTransactionDrawerOpen(false);
  };

  /**
   * Handles successful transaction creation
   * Notifies relevant components to refresh their data
   */
  const handleTransactionSubmit = () => {
    setTransactionDrawerOpen(false);

    // Dispatch global event to notify all components to refresh their data
    dispatchTransactionUpdated();

    // Also refresh the current section if it's relevant
    if (["transactions", "annualReport", "dashhome"].includes(activeSection)) {
      handleMenuItemClick(activeSection);
    }
  };

  // Display loading screen while authentication state is being verified
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", md: "grid" },
          flexDirection: { xs: "column" },
          gridTemplateColumns: { md: "280px 1fr" },
          gridTemplateRows: { md: "90px 1fr" },
          gridTemplateAreas: { md: `"Nav Header" "Nav Content"` },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <DashboardHeader user={user} />
        <DashboardNav
          activeSection={activeSection}
          handleMenuItemClick={handleMenuItemClick}
          menuItems={menuItems}
          onAddTransaction={handleAddTransaction}
          userRole={userRole}
        />
        <DashboardContent activeSection={activeSection} navigate={navigate} />
      </Box>

      {/* Onboarding dialog for new users */}
      <GlobalOnboardingDialog
        open={showOnboarding}
        onClose={handleOnboardingClose}
      />

      {/* Transaction creation drawer */}
      <DrawerBase
        open={transactionDrawerOpen}
        onClose={handleTransactionDrawerClose}
      >
        <TransactionForm
          onClose={handleTransactionDrawerClose}
          onSubmit={handleTransactionSubmit}
        />
      </DrawerBase>
    </>
  );
}
