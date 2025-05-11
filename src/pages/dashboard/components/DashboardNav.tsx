/**
 * Dashboard Navigation Module
 * 
 * Provides responsive navigation for the dashboard interface.
 * 
 * Responsibilities:
 * - Renders different layouts based on screen size (desktop/mobile)
 * - Displays the application logo with theme awareness
 * - Manages navigation menu items with proper highlighting
 * - Provides quick access to transaction creation
 * - Filters menu items based on user role
 * 
 * @module DashboardNav
 */

import { useState, useContext } from 'react';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Fab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

// Utils
import { getIconComponent } from '../../../utils/sectionIconUtils';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';

/**
 * Interface defining a menu item in the navigation
 * 
 * @interface MenuItem
 */
interface MenuItem {
  /** Display label for the menu item */
  label: string;
  
  /** Icon identifier string to render */
  icon: string;
  
  /** Unique identifier for the section */
  key: string;
  
  /** Whether the item should only be shown to admins */
  adminOnly?: boolean;
}

/**
 * Interface for the props of the DashboardNav component
 * 
 * @interface DashboardNavProps
 */
interface DashboardNavProps {
  /** The currently active section of the dashboard */
  activeSection: string;
  
  /** Function to handle clicks on menu items */
  handleMenuItemClick: (sectionKey: string) => void;
  
  /** Array of menu items available in the navigation */
  menuItems: MenuItem[];
  
  /** Optional function to handle the click event for adding a transaction */
  onAddTransaction?: () => void;
  
  /** User role from context for admin item filtering */
  userRole: string | null;
}

/**
 * Logo Component
 * 
 * Displays the application logo, adapting to dark/light mode.
 * 
 * @param {Object} props - The component props
 * @param {boolean} props.isDarkMode - Boolean indicating if dark mode is active
 * @returns {JSX.Element} The rendered Logo component
 */
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
        ? "/logo/logoPL3_white.png"
        : "/logo/logoPL3.svg"}
      alt="logo"
    />
  </Box>
);

/**
 * Interface for the props of the DesktopNavItem component
 * 
 * @interface DesktopNavItemProps
 */
interface DesktopNavItemProps {
  /** Menu item to render */
  item: MenuItem;
  
  /** Currently active section key */
  activeSection: string;
  
  /** Function to handle item click */
  handleMenuItemClick: (key: string) => void;
}

/**
 * Desktop Navigation Item Component
 * 
 * Renders an individual navigation item for desktop view.
 * Highlights the active section and applies hover effects.
 * 
 * @param {DesktopNavItemProps} props - The component props
 * @returns {JSX.Element} The rendered desktop navigation item
 */
const DesktopNavItem = ({
  item,
  activeSection,
  handleMenuItemClick
}: DesktopNavItemProps) => (
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
      {getIconComponent(item.icon)}
    </ListItemIcon>
    <ListItemText primary={item.label} />
  </ListItem>
);

/**
 * Interface for the props of the MobileNavItem component
 * 
 * @interface MobileNavItemProps
 */
interface MobileNavItemProps {
  /** Menu item to render */
  item: MenuItem;
  
  /** Currently active section key */
  activeSection: string;
  
  /** Function to handle item click */
  handleMenuItemClick: (key: string) => void;
}

/**
 * Mobile Navigation Item Component
 * 
 * Renders an individual navigation item for mobile view.
 * Adapts label display based on screen width.
 * 
 * @param {MobileNavItemProps} props - The component props
 * @returns {JSX.Element} The rendered mobile navigation item
 */
const MobileNavItem = ({
  item,
  activeSection,
  handleMenuItemClick
}: MobileNavItemProps) => {
  /**
   * Displays a shortened label for the Annual Report based on screen size
   * 
   * @returns {JSX.Element} The appropriately sized label element
   */
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
      {getIconComponent(item.icon)}
      {displayLabel()}
    </Box>
  );
};

/**
 * Interface for the props of the DesktopNav component
 * 
 * @interface DesktopNavProps
 */
interface DesktopNavProps {
  /** Array of all menu items to display */
  allMenuItems: MenuItem[];
  
  /** Currently active section key */
  activeSection: string;
  
  /** Function to handle menu item clicks */
  handleMenuItemClick: (key: string) => void;
  
  /** Whether dark mode is active */
  isDarkMode: boolean;
}

/**
 * Desktop Navigation Component
 * 
 * Renders the full sidebar navigation for desktop view.
 * Fixed position with scrollable content if needed.
 * 
 * @param {DesktopNavProps} props - The component props
 * @returns {JSX.Element} The rendered desktop navigation
 */
const DesktopNav = ({
  allMenuItems,
  activeSection,
  handleMenuItemClick,
  isDarkMode
}: DesktopNavProps) => (
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

/**
 * Interface for the props of the MobileNav component
 * 
 * @interface MobileNavProps
 */
interface MobileNavProps {
  /** Main menu items for primary navigation */
  mainMenuItems: MenuItem[];
  
  /** Additional menu items for the "more" menu */
  moreMenuItems: MenuItem[];
  
  /** Currently active section key */
  activeSection: string;
  
  /** Function to handle menu item clicks */
  handleMenuItemClick: (key: string) => void;
  
  /** Element to anchor the "more" menu to */
  moreAnchorEl: null | HTMLElement;
  
  /** Function to handle click on the "more" button */
  handleMoreClick: (event: React.MouseEvent<HTMLElement>) => void;
  
  /** Function to close the "more" menu */
  handleMoreClose: () => void;
  
  /** Function to handle clicks on items in the "more" menu */
  handleMoreItemClick: (key: string) => void;
  
  /** Optional function to handle transaction creation */
  onAddTransaction?: () => void;
}

/**
 * Mobile Navigation Component
 * 
 * Renders the bottom navigation bar for mobile view.
 * Includes a floating action button for adding transactions
 * and a "more" button for additional menu items.
 * 
 * @param {MobileNavProps} props - The component props
 * @returns {JSX.Element} The rendered mobile navigation
 */
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
}: MobileNavProps) => {
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
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? theme.palette.primary.light
                : theme.palette.secondary.main,
            },
          }}
        >
          <AddOutlinedIcon />
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
          <MoreHorizOutlinedIcon sx={{ fontSize: '1.4rem' }} />
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
            {getIconComponent(item.icon)}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

/**
 * Dashboard Navigation Component
 * 
 * Main navigation component that renders different layouts
 * based on screen size (desktop or mobile).
 * 
 * @param {DashboardNavProps} props - The component props
 * @param {string} props.activeSection - The currently active section
 * @param {Function} props.handleMenuItemClick - Handler for menu item clicks
 * @param {MenuItem[]} props.menuItems - Available menu items
 * @param {Function} [props.onAddTransaction] - Optional handler for add transaction
 * @param {string|null} props.userRole - User role for filtering menu items
 * @returns {JSX.Element} The rendered navigation component
 */
export default function DashboardNav({ activeSection, handleMenuItemClick, menuItems, onAddTransaction, userRole }: DashboardNavProps) {
  const { isDarkMode } = useContext(ThemeContext);
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);

  // Filter menu items based on user role
  const allMenuItems = menuItems.filter(item =>
    !item.adminOnly || (item.adminOnly && userRole === 'admin')
  );

  // Split items between main navigation and "more" menu for mobile
  const mainMenuItems = allMenuItems.slice(0, 3);
  const moreMenuItems = allMenuItems.slice(3);

  /**
   * Handles click on the "more" button in mobile navigation
   * 
   * @param {React.MouseEvent<HTMLElement>} event - The click event
   */
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  /**
   * Closes the "more" menu
   */
  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  /**
   * Handles click on an item in the "more" menu
   * 
   * @param {string} key - The key of the clicked menu item
   */
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