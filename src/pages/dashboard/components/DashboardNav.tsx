import { useState, useContext } from 'react';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Icon } from '@mui/material';

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
    activeSection: string; // The currently active section
    handleMenuItemClick: (sectionKey: string) => void; // Function to handle clicks on menu items
    menuItems: { label: string; icon: string; key: string; adminOnly?: boolean; }[]; // Array containing the menu items
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
}) => (
  <Box
    onClick={() => handleMenuItemClick(item.key)}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      cursor: 'pointer',
      color: activeSection === item.key ? 'primary.main' : 'text.primary'
    }}
  >
    <Icon className="material-symbols-rounded">{item.icon}</Icon>
    <Box sx={{ fontSize: '0.75rem' }}>{item.label}</Box>
  </Box>
);

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
  handleMoreItemClick
}: { 
  mainMenuItems: MenuItem[]; 
  moreMenuItems: MenuItem[];
  activeSection: string; 
  handleMenuItemClick: (key: string) => void;
  moreAnchorEl: null | HTMLElement;
  handleMoreClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleMoreClose: () => void;
  handleMoreItemClick: (key: string) => void;
}) => (
  <Box sx={{
    display: { xs: 'block', md: 'none' },
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 999
  }}>
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        pt: 2,
        px: 1,
        pb: 4,
        borderRadius: '15px 15px 0 0',
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
          gap: 0.5,
          cursor: 'pointer',
          color: moreMenuItems.some(item => activeSection === item.key) ? 'primary.main' : 'text.primary'
        }}
      >
        <Icon className="material-symbols-rounded">more_horiz</Icon>
        <Box sx={{ fontSize: '0.75rem' }}>More</Box>
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

export default function DashboardNav({ activeSection, handleMenuItemClick, menuItems }: DashboardNavProps) {
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
      />
    </>
  );
}