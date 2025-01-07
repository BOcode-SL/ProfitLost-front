import { Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Icon } from '@mui/material';
import './DashboardNav.scss';

interface DashboardNavProps {
    activeSection: string;
    handleMenuItemClick: (sectionName: string) => void;
    menuItems: { label: string; icon: string; }[];
}

const DashboardNav = ({ activeSection, handleMenuItemClick, menuItems }: DashboardNavProps) => {
    return (
        <>
            <Box className='dashboard__nav'>
                <Paper
                    elevation={2}
                    className='dashboard__nav-container'
                    sx={{
                        height: '100%',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box className='dashboard__nav-img'>
                        {/* Cuando se pone en dark mode, el texto debe ser blanco */}
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
                                    borderRadius: 2,
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
                                            color: 'primary.ccontrastText',
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
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    {menuItems.slice(0, 4).map((item) => (
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
                </Paper>
            </Box>
        </>
    );
};

export default DashboardNav;

