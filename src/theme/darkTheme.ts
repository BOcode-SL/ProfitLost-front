import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff8f4c',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6b22',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        divider: 'rgba(255,255,255,0.11)',
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255,255,255,0.7)',
        },
    },
    typography: {
        fontFamily: '"Rubik", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap");
            `,
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 46,
                    height: 27,
                    padding: 0,
                    margin: 8,
                },
                switchBase: {
                    padding: 1,
                    '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: 'none',
                            backgroundColor: '#ff8f4c',
                        },
                    },
                },
                thumb: {
                    width: 24,
                    height: 24,
                },
                track: {
                    borderRadius: 13,
                    border: '1px solid #555',
                    backgroundColor: '#333',
                    opacity: 1,
                    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                },
            },
        },
    },
};

export const darkTheme = createTheme(themeOptions); 