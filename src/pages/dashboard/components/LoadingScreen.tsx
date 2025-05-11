/**
 * Loading Screen Module
 * 
 * Provides a simple loading indicator with the application logo
 * while content is being fetched or application state is initializing.
 * 
 * Responsibilities:
 * - Displays a full-screen loading visual
 * - Shows application branding during loading states
 * - Adapts to the current theme via background color
 * 
 * @module LoadingScreen
 */

import Box from '@mui/material/Box';

/**
 * Loading Screen Component
 * 
 * Displays a centered loading animation with the application logo
 * while content is being fetched or processed.
 * Used during authentication verification and initial data loading.
 * 
 * @returns {JSX.Element} The rendered LoadingScreen component
 */
const LoadingScreen = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}>
            <Box
                component="img"
                src="/logo/logoPL.svg"
                alt="logo"
                sx={{
                    width: 200,
                    userSelect: 'none'
                }}
            />
        </Box>
    );
};

export default LoadingScreen; 