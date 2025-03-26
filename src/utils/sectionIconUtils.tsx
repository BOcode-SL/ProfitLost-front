import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

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
    case 'analytics':
      return <QueryStatsOutlinedIcon />;
    case 'notifications':
      return <NotificationsOutlinedIcon />;
    default:
      return <SpaceDashboardOutlinedIcon />;
  }
}; 