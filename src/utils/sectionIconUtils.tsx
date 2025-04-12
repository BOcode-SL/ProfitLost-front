/**
 * Section Icon Utilities
 * 
 * Provides mapping from icon names to Material UI icon components.
 * Used throughout the application to maintain consistent icon usage.
 */
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

/**
 * Returns the appropriate Material UI icon component based on the icon name
 * 
 * Maps string identifiers to their corresponding icon components, enabling
 * dynamic icon selection throughout the application. This provides a
 * centralized place to change icons and ensures visual consistency.
 * 
 * @param iconName - String identifier for the desired icon
 * @returns React element containing the appropriate Material UI icon component
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
    case 'notifications':
      return <NotificationsOutlinedIcon />;
    default:
      return <SpaceDashboardOutlinedIcon />; // Fallback to dashboard icon
  }
}; 