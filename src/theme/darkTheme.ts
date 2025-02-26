import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        chart: {
            income: string;
            expenses: string;
        };
        status: {
            success: {
                bg: string;
                text: string;
            };
            error: {
                bg: string;
                text: string;
            };
        };
    }
    interface PaletteOptions {
        chart?: {
            income: string;
            expenses: string;
        };
        status?: {
            success: {
                bg: string;
                text: string;
            };
            error: {
                bg: string;
                text: string;
            };
        };
    }
}

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#fe6f14',
            light: '#ff8e38',
            dark: '#c63b08',
            contrastText: '#fff7ed',
        },
        secondary: {
            main: '#ff8e38',
            light: '#ffb771',
            dark: '#ef5107',
            contrastText: '#fff7ed',
        },
        background: {
            default: '#0E0E11',
            paper: '#18181B',
        },
        chart: {
            income: '#ffb771',
            expenses: '#ef5107'
        },
        status: {
            success: {
                bg: '#132f1a',
                text: '#9dd89f'
            },
            error: {
                bg: '#441206',
                text: '#f77572'
            }
        },
        divider: 'rgba(255,255,255,0.08)',
        text: {
            primary: '#fff7ed',
            secondary: '#ffecd4',
        },
    },
    typography: {
        fontFamily: '"Rubik", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: '"Rubik", sans-serif',
                }
            }
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
                            backgroundColor: '#ff6b22',
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
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
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
                    color: '#fff7ed',
                    '&:hover': {
                        backgroundColor: '#ff8e38',
                    },
                },
                outlined: {
                    borderColor: '#fe6f14',
                    color: '#fe6f14',
                    '&:hover': {
                        borderColor: '#ff8e38',
                        backgroundColor: 'rgba(254, 111, 20, 0.08)',
                    },
                },
                text: {
                    color: '#fe6f14',
                    '&:hover': {
                        backgroundColor: 'rgba(254, 111, 20, 0.08)',
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
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#18181B',
                },
                elevation0: {
                    boxShadow: 'none',
                },
                elevation1: {
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 2px',
                },
                elevation2: {
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 4px',
                },
                elevation3: {
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 6px',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                modal: {
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(14, 14, 17, 0.8)',
                        backdropFilter: 'blur(8px)',
                    }
                },
                paper: {
                    backgroundColor: '#18181B',
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
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    padding: '6px 16px',
                    border: '1px solid rgba(255, 247, 237, 0.12)',
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-selected': {
                        backgroundColor: '#fe6f14',
                        color: '#fff7ed',
                        '&:hover': {
                            backgroundColor: '#ff8e38',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(254, 111, 20, 0.08)',
                    },
                },
                sizeSmall: {
                    padding: '4px 12px',
                },
            },
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease-in-out',
                    '& .MuiToggleButton-root': {
                        border: '1px solid rgba(255, 247, 237, 0.12)',
                        transition: 'all 0.2s ease-in-out',
                        '&:not(:first-of-type)': {
                            borderLeft: '1px solid rgba(255, 247, 237, 0.12)',
                            marginLeft: '0',
                        },
                    },
                },
            },
        },
    },
};

export const darkTheme = createTheme(themeOptions); 