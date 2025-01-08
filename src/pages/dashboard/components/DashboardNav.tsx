import { useState } from 'react';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Icon } from '@mui/material';

import './DashboardNav.scss';

interface DashboardNavProps {
    activeSection: string;
    handleMenuItemClick: (sectionName: string) => void;
    menuItems: { label: string; icon: string; }[];
}

const DashboardNav = ({ activeSection, handleMenuItemClick, menuItems }: DashboardNavProps) => {
    const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);

    const mainMenuItems = menuItems.slice(0, 3); // Dashboard, Annual Report, Movements
    const moreMenuItems = menuItems.slice(3); // Resto de items

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setMoreAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setMoreAnchorEl(null);
    };

    const handleMoreItemClick = (label: string) => {
        handleMenuItemClick(label);
        handleMoreClose();
    };

    return (
        <>
            <Box className='dashboard__nav'>
                <Paper
                    elevation={2}
                    className='dashboard__nav-container'
                    sx={{
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box className='dashboard__nav-img'>
                        <img
                            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                            alt="logo"
                        />
                    </Box>

                    <List sx={{ px: 2 }}>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.label}
                                onClick={() => handleMenuItemClick(item.label)}
                                sx={{
                                    borderRadius: 3,
                                    mb: 0.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'primary.main'
                                    },
                                    ...(activeSection === item.label && {
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
                        ))}
                    </List>
                </Paper>
            </Box>

            <Box className='dashboard__nav-mobile'>
                <Paper
                    elevation={0}
                    className='mobile-nav'
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        p: 1,
                        borderRadius: '12px 12px 0 0',
                        bgcolor: 'background.paper'
                    }}
                >
                    {mainMenuItems.map((item) => (
                        <Box
                            key={item.label}
                            onClick={() => handleMenuItemClick(item.label)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                color: activeSection === item.label ? 'primary.main' : 'text.primary'
                            }}
                        >
                            <Icon className="material-symbols-rounded">{item.icon}</Icon>
                            <Box sx={{ fontSize: '0.75rem' }}>{item.label}</Box>
                        </Box>
                    ))}
                    <Box
                        onClick={handleMoreClick}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            color: moreMenuItems.some(item => activeSection === item.label) ? 'primary.main' : 'text.primary'
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
                            key={item.label}
                            onClick={() => handleMoreItemClick(item.label)}
                            sx={{
                                color: activeSection === item.label ? 'primary.main' : 'text.primary',
                                gap: 2
                            }}
                        >
                            <Icon className="material-symbols-rounded">{item.icon}</Icon>
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </>
    );
};

export default DashboardNav;

