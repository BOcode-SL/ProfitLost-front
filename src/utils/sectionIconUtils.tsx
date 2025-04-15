/**
 * Section Icon Utilities
 * 
 * Provides mapping from icon names to Material UI icon components.
 * Used throughout the application to maintain consistent icon usage
 * across navigation, sections, and UI elements.
 * 
 * @module SectionIconUtils
 */
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

/**
 * Returns the appropriate Material UI icon component based on the icon name
 * 
 * Maps string identifiers to their corresponding icon components, enabling
 * dynamic icon selection throughout the application. This provides a
 * centralized place to change icons and ensures visual consistency.
 * 
 * Supported icons:
 * - 'home': Dashboard icon for home/main pages
 * - 'bar_chart_4_bars': Chart icon for analytics/reports sections
 * - 'receipt_long': Receipt icon for transaction-related sections
 * - 'account_balance': Wallet icon for account/balance sections
 * - 'note_alt': Note icon for documentation/notes sections
 * 
 * @param {string} iconName - String identifier for the desired icon
 * @returns {ReactElement} React element containing the appropriate Material UI icon component
 */
export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'home':
      return <SpaceDashboardOutlinedIcon />;
    case 'bar_chart_4_bars':
      return <AssessmentOutlinedIcon />;
    case 'receipt_long':
      return <ReceiptLongRoundedIcon />;
    case 'account_balance':
      return <AccountBalanceWalletOutlinedIcon />;
    case 'note_alt':
      return <NoteAltOutlinedIcon />;
    default:
      return <SpaceDashboardOutlinedIcon />; // Fallback to dashboard icon
  }
}; 