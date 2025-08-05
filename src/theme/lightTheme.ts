/**
 * Light Theme Configuration
 * 
 * Defines the light mode theme settings for the application using Material-UI's theming system.
 * Includes custom palette colors, typography, and component style overrides.
 * Used as the default theme or when the user manually selects light mode in settings.
 * 
 * @module LightTheme
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * Type declaration extensions for Material-UI's theme
 * Adds custom palette options for chart colors and status indicators
 * These extensions allow TypeScript to recognize our custom theme properties
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
 * These settings create a clean, bright UI with our brand's orange accent color
 */
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#fe6f14',
            light: '#fb923c',
            dark: '#c84f03',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#c84f03',
            light: '#ff8e38',
            dark: '#a63c02',
        },
        background: {
            default: '#f0f2f5', // background.primary
            paper: '#ffffff',   // background.card
        },
        chart: {
            income: '#ff8e38',  // Income chart color
            expenses: '#c84f03' // Expenses chart color
        },
        status: {
            success: {
                bg: '#e8f5e8',  // success.50
                text: '#2e7d32'  // success.700
            },
            error: {
                bg: '#ffebee',   // error.50
                text: '#d32f2f'  // error.700
            }
        },
        divider: 'rgba(0, 0, 0, 0.05)', // border.primary
        text: {
            primary: '#2c3e50',   // text.primary
            secondary: 'rgba(44, 62, 80, 0.7)', // text.secondary
        },
        // Colores semánticos adicionales
        success: {
            main: '#4caf50', // success.500
            light: '#66bb6a', // success.400
            dark: '#388e3c',  // success.700
        },
        warning: {
            main: '#ffc107', // warning.500
            light: '#ffca28', // warning.400
            dark: '#ffa000',  // warning.700
        },
        error: {
            main: '#f44336', // error.500
            light: '#ef5350', // error.400
            dark: '#d32f2f',  // error.700
        },
        grey: {
            50: '#f8f9fa',
            100: '#f0f2f5',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#6c757d',
            700: '#495057',
            800: '#343a40',
            900: '#212529',
        },
    },
    typography: {
        fontFamily: '"Rubik", sans-serif',
        h1: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 600,
            fontSize: '2.25rem', // 36px
            lineHeight: 1.2,
        },
        h2: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 600,
            fontSize: '1.875rem', // 30px
            lineHeight: 1.2,
        },
        h3: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem', // 24px
            lineHeight: 1.2,
        },
        h4: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 500,
            fontSize: '1.25rem', // 20px
            lineHeight: 1.2,
        },
        h5: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 500,
            fontSize: '1.125rem', // 18px
            lineHeight: 1.2,
        },
        h6: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 500,
            fontSize: '1rem', // 16px
            lineHeight: 1.2,
        },
        body1: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 400,
            fontSize: '1rem', // 16px
            lineHeight: 1.5,
        },
        body2: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem', // 14px
            lineHeight: 1.5,
        },
        button: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 500,
            fontSize: '1rem', // 16px
            lineHeight: 1.5,
            textTransform: 'none',
        },
        caption: {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 400,
            fontSize: '0.75rem', // 12px
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        // Global CSS overrides
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: '"Rubik", sans-serif',
                    backgroundColor: '#f0f2f5',
                    color: '#2c3e50',
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
                    fontFamily: '"Rubik", sans-serif',
                },
                sizeSmall: {
                    height: '32px',
                    padding: '0px 12px',
                    fontSize: '0.875rem',
                },
                sizeMedium: {
                    height: '44px',
                    padding: '0px 16px',
                },
                sizeLarge: {
                    height: '56px',
                    padding: '0px 24px',
                    fontSize: '1.125rem',
                },
                contained: {
                    backgroundColor: '#fe6f14',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#c84f03',
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 4px',
                    },
                    '&:active': {
                        backgroundColor: '#a63c02',
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
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px',
                    transition: 'all 0.3s ease',
                },
                elevation0: {
                    boxShadow: 'none',
                },
                elevation1: {
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px',
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
                    fontFamily: '"Rubik", sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '8px',
                        borderColor: '#e9ecef',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ced4da',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fe6f14',
                        borderWidth: '2px',
                    },
                }
            }
        },
        // Outlined input component overrides
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                }
            }
        },
        // Input label component overrides
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: '"Rubik", sans-serif',
                    color: '#6c757d',
                    '&.Mui-focused': {
                        color: '#fe6f14',
                    },
                }
            }
        },
        // Toggle button component overrides
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    padding: '8px 16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    fontFamily: '"Rubik", sans-serif',
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
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                },
            },
        },
        // Toggle button group component overrides
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease-in-out',
                    '& .MuiToggleButton-root': {
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease-in-out',
                        '&:not(:first-of-type)': {
                            borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
                            marginLeft: '0',
                        },
                    },
                },
            },
        },
        // Card component overrides
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                }
            }
        },
        // Chip component overrides
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: '"Rubik", sans-serif',
                    borderRadius: '8px',
                    fontWeight: 500,
                }
            }
        },
        // Menu component overrides
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 4px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                }
            }
        },
        // Dialog component overrides
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 8px',
                }
            }
        },
        // AppBar component overrides
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#2c3e50',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px',
                }
            }
        },
    },
};

// Create and export the light theme
export const lightTheme = createTheme(themeOptions);