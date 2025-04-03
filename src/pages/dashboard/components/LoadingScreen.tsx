import Box from '@mui/material/Box';

/**
 * Loading Screen Component
 * 
 * Displays a centered loading animation with the application logo
 * while content is being fetched or processed.
 * Used during authentication verification and initial data loading.
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
                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg"
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