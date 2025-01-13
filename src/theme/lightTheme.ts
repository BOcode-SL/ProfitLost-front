import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#fe6f14',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#c84f03',
        },
        background: {
            default: '#f7f7f7',
            paper: '#ffffff',
        },
        divider: 'rgba(0,0,0,0.11)',
        text: {
            primary: '#000000',
            secondary: 'rgba(0,0,0,0.7)',
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
                        },
                    },
                },
                thumb: {
                    width: 24,
                    height: 24,
                },
                track: {
                    borderRadius: 13,
                    border: '1px solid #bdbdbd',
                    backgroundColor: '#f7f7f7',
                    opacity: 1,
                    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-in-out',
                },
                sizeSmall: {
                    height: '35px',
                    padding: '0px 16px',
                    fontSize: '0.9rem',
                },
                sizeMedium: {
                    height: '45px',
                    padding: '0px 24px',
                },
                sizeLarge: {
                    height: '55px',
                    padding: '0px 32px',
                    fontSize: '1.1rem',
                },
                contained: {
                    backgroundColor: '#fe6f14',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#c84f03',
                    },
                },
                outlined: {
                    borderColor: '#fe6f14',
                    color: '#fe6f14',
                    '&:hover': {
                        borderColor: '#c84f03',
                        backgroundColor: 'rgba(254, 111, 20, 0.04)',
                    },
                },
                text: {
                    color: '#fe6f14',
                    '&:hover': {
                        backgroundColor: 'rgba(254, 111, 20, 0.04)',
                    },
                },
            },
            defaultProps: {
                disableElevation: true,
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '0.5rem 0rem',
                    backgroundColor: '#ffffff',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 4px',
                    transition: 'all 0.3s ease',
                },
                elevation0: {
                    boxShadow: 'none',
                },
                elevation1: {
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px',
                },
                elevation2: {
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 4px',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                modal: {
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        backdropFilter: 'blur(5px)',
                    }
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '8px',
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                }
            }
        }
    },
};

export const lightTheme = createTheme(themeOptions);