import { useState, useContext } from 'react';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Icon } from '@mui/material';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';

// Interface for the props of the DashboardNav component
interface DashboardNavProps {
    activeSection: string; // The currently active section
    handleMenuItemClick: (sectionKey: string) => void; // Function to handle clicks on menu items
    menuItems: { label: string; icon: string; key: string; }[]; // Array containing the menu items
}

// DashboardNav component
export default function DashboardNav({ activeSection, handleMenuItemClick, menuItems }: DashboardNavProps) {
    const { isDarkMode } = useContext(ThemeContext);
    const { user } = useUser();

    const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);

    // Add the Analytics item if the user is an admin
    const allMenuItems = user?.role === 'admin' 
        ? [...menuItems, { label: 'Analytics', icon: 'analytics', key: 'analytics' }]
        : menuItems;

    const mainMenuItems = allMenuItems.slice(0, 3); // Retrieve the first three menu items for the main menu
    const moreMenuItems = allMenuItems.slice(3); // Retrieve the remaining menu items for the "more" menu

    // Function to handle the click event for the "more" button
    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setMoreAnchorEl(event.currentTarget);
    };

    // Function to close the "more" menu
    const handleMoreClose = () => {
        setMoreAnchorEl(null);
    };

    // Function to handle clicks on additional menu items
    const handleMoreItemClick = (label: string) => {
        handleMenuItemClick(label);
        handleMoreClose();
    };

    // Return the main navigation component
    return (
        <>
            {/* Box for the fixed navigation on larger screens */}
            <Box sx={{
                gridArea: 'Nav',
                position: 'fixed',
                height: '100vh',
                width: '280px',
                p: 2,
                zIndex: 999,
                display: { xs: 'none', md: 'block' }
            }}>
                {/* Paper component to contain the navigation items */}
                <Paper
                    elevation={3}
                    sx={{
                        height: '100%',
                        borderRadius: 3,
                    }}
                >
                    {/* Box for displaying the logo */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 3,
                        '& img': {
                            width: '75%',
                            userSelect: 'none'
                        }
                    }}>
                        {/* Conditional rendering of the logo based on dark mode */}
                        {isDarkMode ? (
                            <img
                                className="no-select"
                                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1737624634/logoPL3_white.png"
                                alt="logo"
                            />
                        ) : (
                            <img
                                className="no-select"
                                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                                alt="logo"
                            />
                        )}
                    </Box>

                    {/* List of menu items */}
                    <List sx={{ px: 2 }}>
                        {allMenuItems.map((item) => (
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
                                {/* Icon for the menu item */}
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    <Icon className="material-symbols-rounded">{item.icon}</Icon>
                                </ListItemIcon>
                                {/* Text for the menu item */}
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* Box for the bottom navigation on smaller screens */}
            <Box sx={{
                display: { xs: 'block', md: 'none' },
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                zIndex: 999
            }}>
                {/* Paper component for the bottom navigation items */}
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
                    {/* List of main menu items */}
                    {mainMenuItems.map((item) => (
                        <Box
                            key={item.label}
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
                            {/* Icon for the bottom menu item */}
                            <Icon className="material-symbols-rounded">{item.icon}</Icon>
                            {/* Text for the bottom menu item */}
                            <Box sx={{ fontSize: '0.75rem' }}>{item.label}</Box>
                        </Box>
                    ))}
                    {/* Box for the "More" menu item */}
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

                {/* Menu for additional items */}
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
                    {/* List of additional menu items */}
                    {moreMenuItems.map((item) => (
                        <MenuItem
                            key={item.label}
                            onClick={() => handleMoreItemClick(item.key)}
                            sx={{
                                color: activeSection === item.key ? 'primary.main' : 'text.primary',
                                gap: 2
                            }}
                        >
                            {/* Icon for the additional menu item */}
                            <Icon className="material-symbols-rounded">{item.icon}</Icon>
                            {/* Text for the additional menu item */}
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </>
    );
};