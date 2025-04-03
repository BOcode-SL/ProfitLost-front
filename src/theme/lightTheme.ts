/**
 * Light Theme Configuration
 * 
 * Defines the light mode theme settings for the application using Material-UI's theming system.
 * Includes custom palette colors, typography, and component style overrides.
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * Type declaration extensions for Material-UI's theme
 * Adds custom palette options for chart colors and status indicators
 */
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

/**
 * Light theme configuration options
 * Defines colors, typography, and component style overrides
 */
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
            default: '#f0f2f5', // Main app background
            paper: '#f8f9fa',   // Component background
        },
        chart: {
            income: '#ff8e38',  // Income chart color
            expenses: '#9d300f' // Expenses chart color
        },
        status: {
            success: {
                bg: '#e8f5e9',  // Success background
                text: '#2e7d32'  // Success text
            },
            error: {
                bg: '#ffebee',   // Error background
                text: '#d32f2f'  // Error text
            }
        },
        divider: 'rgba(0 0 0 / 0.05)',
        text: {
            primary: '#2c3e50',   // Main text color
            secondary: 'rgba(44, 62, 80, 0.7)', // Secondary text color
        },
    },
    typography: {
        fontFamily: '"Rubik", sans-serif',
    },
    components: {
        // Global CSS overrides
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: '"Rubik", sans-serif',
                }
            }
        },
        // Switch component overrides
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
                    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),border 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
        // Button component overrides
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
        // Paper component overrides
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '0.5rem 0rem',
                    backgroundColor: '#f8f9fa',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px',
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
        // Drawer component overrides
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#f0f2f5',
                },
                modal: {
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        backdropFilter: 'blur(5px)',
                    }
                }
            }
        },
        // Input base component overrides
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
        // Outlined input component overrides
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                }
            }
        },
        // Input label component overrides
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                }
            }
        },
        // Toggle button component overrides
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    padding: '6px 16px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s ease-in-out',
                    '&.Mui-selected': {
                        backgroundColor: '#fe6f14',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#c84f03',
                            transition: 'all 0.3s ease-in-out',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(254, 111, 20, 0.04)',
                        transition: 'all 0.3s ease-in-out',
                    },
                },
                sizeSmall: {
                    padding: '4px 12px',
                },
            },
        },
        // Toggle button group component overrides
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease-in-out',
                    '& .MuiToggleButton-root': {
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s ease-in-out',
                        '&:not(:first-of-type)': {
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                            marginLeft: '0',
                        },
                    },
                },
            },
        },
    },
};

// Create and export the light theme
export const lightTheme = createTheme(themeOptions);