import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'home':
      return <HomeOutlinedIcon />;
    case 'bar_chart_4_bars':
      return <AssessmentOutlinedIcon />;
    case 'receipt_long':
      return <ReceiptLongOutlinedIcon />;
    case 'account_balance':
      return <AccountBalanceWalletOutlinedIcon />;
    case 'note_alt':
      return <NoteAltOutlinedIcon />;
    case 'analytics':
      return <QueryStatsOutlinedIcon />;
    case 'notifications':
      return <NotificationsOutlinedIcon />;
    default:
      return <HomeOutlinedIcon />;
  }
}; 