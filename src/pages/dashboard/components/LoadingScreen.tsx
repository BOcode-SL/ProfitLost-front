import Box from '@mui/material/Box';

// LoadingScreen component displays a centered loading screen with a logo
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