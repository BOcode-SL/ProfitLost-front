import { useState, useContext } from 'react';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Icon, Fab } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';

// Types
interface MenuItem {
  label: string;
  icon: string;
  key: string;
  adminOnly?: boolean;
}

interface DashboardNavProps {
  activeSection: string; // The currently active section of the dashboard
  handleMenuItemClick: (sectionKey: string) => void; // Function to handle clicks on menu items
  menuItems: { label: string; icon: string; key: string; adminOnly?: boolean; }[]; // Array of menu items available in the navigation
  onAddTransaction?: () => void; // Optional function to handle the click event for adding a transaction
}

// Logo component
const Logo = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    py: 3,
    '& img': {
      width: '75%',
      userSelect: 'none'
    }
  }}>
    <img
      className="no-select"
      src={isDarkMode
        ? "https://res.cloudinary.com/dnhlagojg/image/upload/v1737624634/logoPL3_white.png"
        : "https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"}
      alt="logo"
    />
  </Box>
);

// Desktop navigation item
const DesktopNavItem = ({
  item,
  activeSection,
  handleMenuItemClick
}: {
  item: MenuItem;
  activeSection: string;
  handleMenuItemClick: (key: string) => void;
}) => (
  <ListItem
    key={item.label}
    onClick={() => handleMenuItemClick(item.key)}
    sx={{
      borderRadius: 3,
      mb: 0.5,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: 'primary.main'
      },
      ...(activeSection === item.key && {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        '&:hover': {
          color: 'primary.contrastText',
        }
      })
    }}
  >
    <ListItemIcon sx={{ color: 'inherit' }}>
      <Icon className="material-symbols-rounded">{item.icon}</Icon>
    </ListItemIcon>
    <ListItemText primary={item.label} />
  </ListItem>
);

// Mobile navigation item
const MobileNavItem = ({
  item,
  activeSection,
  handleMenuItemClick
}: {
  item: MenuItem;
  activeSection: string;
  handleMenuItemClick: (key: string) => void;
}) => {
  // Function to display a shortened label for the Annual Report
  const displayLabel = () => {
    if (item.key === 'annualReport') {
      // Use specific shortened versions for the Annual Report
      const isEnglish = item.label.includes('Annual');
      const shortLabel = isEnglish ? 'Annual' : 'Anual';

      // Determine if the shortened version should be used based on screen width
      const useShortVersion = window.innerWidth < 360; // Example threshold

      return (
        <Box sx={{ fontSize: '0.7rem', textAlign: 'center' }}>
          {useShortVersion ? shortLabel : item.label}
        </Box>
      );
    }

    return <Box sx={{ fontSize: '0.7rem', textAlign: 'center' }}>{item.label}</Box>;
  };

  return (
    <Box
      onClick={() => handleMenuItemClick(item.key)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        cursor: 'pointer',
        color: activeSection === item.key ? 'primary.main' : 'text.primary',
        width: '25%', // Equal width for all items
        height: '100%',
        px: 0.5
      }}
    >
      <Icon className="material-symbols-rounded" sx={{ fontSize: '1.4rem' }}>{item.icon}</Icon>
      {displayLabel()}
    </Box>
  );
};

// Desktop navigation
const DesktopNav = ({
  allMenuItems,
  activeSection,
  handleMenuItemClick,
  isDarkMode
}: {
  allMenuItems: MenuItem[];
  activeSection: string;
  handleMenuItemClick: (key: string) => void;
  isDarkMode: boolean;
}) => (
  <Box sx={{
    gridArea: 'Nav',
    position: 'fixed',
    height: '100vh',
    width: '280px',
    p: 2,
    zIndex: 999,
    display: { xs: 'none', md: 'block' }
  }}>
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        borderRadius: 3,
      }}
    >
      <Logo isDarkMode={isDarkMode} />

      <List sx={{ px: 2 }}>
        {allMenuItems.map((item) => (
          <DesktopNavItem
            key={item.key}
            item={item}
            activeSection={activeSection}
            handleMenuItemClick={handleMenuItemClick}
          />
        ))}
      </List>
    </Paper>
  </Box>
);

// Mobile navigation
const MobileNav = ({
  mainMenuItems,
  moreMenuItems,
  activeSection,
  handleMenuItemClick,
  moreAnchorEl,
  handleMoreClick,
  handleMoreClose,
  handleMoreItemClick,
  onAddTransaction
}: {
  mainMenuItems: MenuItem[];
  moreMenuItems: MenuItem[];
  activeSection: string;
  handleMenuItemClick: (key: string) => void;
  moreAnchorEl: null | HTMLElement;
  handleMoreClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleMoreClose: () => void;
  handleMoreItemClick: (key: string) => void;
  onAddTransaction?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{
      display: { xs: 'block', md: 'none' },
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 999
    }}>
      {onAddTransaction && (
        <Fab
          color="primary"
          aria-label="add transaction"
          onClick={onAddTransaction}
          sx={{
            position: 'absolute',
            top: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            boxShadow: 3,
            borderRadius: '8px',
            width: '48px',
            height: '36px',
            minHeight: 'unset',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.secondary.main,
            },
          }}
        >
          <Icon className="material-symbols-rounded">add</Icon>
        </Fab>
      )}

      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 2.5,
          px: 1,
          pb: 3.5,
          borderRadius: '15px 15px 0 0',
          position: 'relative',
        }}
      >
        {mainMenuItems.map((item) => (
          <MobileNavItem
            key={item.key}
            item={item}
            activeSection={activeSection}
            handleMenuItemClick={handleMenuItemClick}
          />
        ))}

        <Box
          onClick={handleMoreClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: moreMenuItems.some(item => activeSection === item.key) ? 'primary.main' : 'text.primary',
            width: '25%', // Equal width for all items
            height: '100%'
          }}
        >
          <Icon className="material-symbols-rounded" sx={{ fontSize: '1.4rem' }}>more_horiz</Icon>
          <Box sx={{ fontSize: '0.7rem', textAlign: 'center' }}>{t('dashboard.common.more')}</Box>
        </Box>
      </Paper>

      <Menu
        anchorEl={moreAnchorEl}
        open={Boolean(moreAnchorEl)}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {moreMenuItems.map((item) => (
          <MenuItem
            key={item.key}
            onClick={() => handleMoreItemClick(item.key)}
            sx={{
              color: activeSection === item.key ? 'primary.main' : 'text.primary',
              gap: 2
            }}
          >
            <Icon className="material-symbols-rounded">{item.icon}</Icon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default function DashboardNav({ activeSection, handleMenuItemClick, menuItems, onAddTransaction }: DashboardNavProps) {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useUser();
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);

  // Filter menu items based on user role
  const allMenuItems = menuItems.filter(item =>
    !item.adminOnly || (item.adminOnly && user?.role === 'admin')
  );

  const mainMenuItems = allMenuItems.slice(0, 3);
  const moreMenuItems = allMenuItems.slice(3);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const handleMoreItemClick = (key: string) => {
    handleMenuItemClick(key);
    handleMoreClose();
  };

  return (
    <>
      <DesktopNav
        allMenuItems={allMenuItems}
        activeSection={activeSection}
        handleMenuItemClick={handleMenuItemClick}
        isDarkMode={isDarkMode}
      />

      <MobileNav
        mainMenuItems={mainMenuItems}
        moreMenuItems={moreMenuItems}
        activeSection={activeSection}
        handleMenuItemClick={handleMenuItemClick}
        moreAnchorEl={moreAnchorEl}
        handleMoreClick={handleMoreClick}
        handleMoreClose={handleMoreClose}
        handleMoreItemClick={handleMoreItemClick}
        onAddTransaction={onAddTransaction}
      />
    </>
  );
}