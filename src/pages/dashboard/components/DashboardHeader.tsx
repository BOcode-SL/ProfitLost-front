import { useEffect, useCallback, useContext } from 'react';
import { Box, Badge, Avatar, Paper } from '@mui/material';

import { ThemeContext } from '../../../theme/ThemeContext';
import './DashboardHeader.scss';

interface DashboardHeaderProps {
    userImage?: string;
    userName?: string;
}

const DashboardHeader = ({ userImage, userName }: DashboardHeaderProps) => {
    const { toggleTheme, isDarkMode } = useContext(ThemeContext);

    const handleScroll = useCallback(() => {
        const headerContainer = document.querySelector('.dashboard__header-container');
        if (headerContainer) {
            headerContainer.classList.toggle('scrolled', window.scrollY > 0);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <Box className='dashboard__header'>
            <Paper
                elevation={2}
                className='dashboard__header-container'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 2,
                    p: 1,
                    borderRadius: 2
                }}
            >
                <button className="theme-toggle" onClick={toggleTheme}> {/*hacer que en el dark mode el icono sea blanco */}
                    <span className="material-symbols-rounded">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                <Badge
                    color="secondary"
                    variant="dot"
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8,
                        }
                    }}
                >
                    <span className="material-symbols-rounded">
                        mail
                    </span>
                </Badge>
                <Avatar
                    src={userImage}
                    alt={userName}
                    sx={{
                        width: 40,
                        height: 40,
                        cursor: 'pointer',
                        bgcolor: 'primary.main'
                    }}
                >
                    {userName?.[0]}
                </Avatar>
            </Paper>
        </Box>
    );
};

export default DashboardHeader;
