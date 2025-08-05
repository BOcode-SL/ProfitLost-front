/**
 * Dark Theme Configuration
 * 
 * Defines the dark mode theme settings for the application using Material-UI's theming system.
 * Includes custom palette colors, typography, and component style overrides.
 * Used when the user prefers dark mode or manually selects it in settings.
 * 
 * @module DarkTheme
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
 * Dark theme configuration options
 * Defines colors, typography, and component style overrides
 * These settings create a cohesive dark UI with our brand's orange accent color
 */
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#fe6f14', // Color principal de ProfitLost
            light: '#ff8e38',
            dark: '#c84f03',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff8e38',
            light: '#ffb771',
            dark: '#ef5107',
            contrastText: '#ffffff',
        },
        background: {
            default: '#0E0E11', // background.primary
            paper: '#18181B',   // background.card
        },
        chart: {
            income: '#ffb771',  // Income chart color
            expenses: '#ef5107' // Expenses chart color
        },
        status: {
            success: {
                bg: '#132f1a',  // status.success.bg
                text: '#9dd89f'  // status.success.text
            },
            error: {
                bg: '#441206',   // status.error.bg
                text: '#f77572'  // status.error.text
            }
        },
        divider: 'rgba(128, 128, 128, 0.27)', // border.secondary
        text: {
            primary: '#FFFFFF',   // text.primary
            secondary: '#BDBDBD', // text.secondary
        },
        // Colores semánticos adicionales
        success: {
            main: '#66bb6a', // success.400
            light: '#81c784', // success.300
            dark: '#4caf50',  // success.500
        },
        warning: {
            main: '#ffca28', // warning.400
            light: '#ffd54f', // warning.300
            dark: '#ffc107',  // warning.500
        },
        error: {
            main: '#ef5350', // error.400
            light: '#e57373', // error.300
            dark: '#f44336',  // error.500
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
                    backgroundColor: '#0E0E11',
                    color: '#FFFFFF',
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
                            backgroundColor: '#fe6f14',
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
                        backgroundColor: '#ff8e38',
                        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
                    },
                    '&:active': {
                        backgroundColor: '#ef5107',
                    },
                },
                outlined: {
                    borderColor: '#fe6f14',
                    color: '#fe6f14',
                    '&:hover': {
                        borderColor: '#ff8e38',
                        backgroundColor: 'rgba(254, 111, 20, 0.12)',
                    },
                },
                text: {
                    color: '#fe6f14',
                    '&:hover': {
                        backgroundColor: 'rgba(254, 111, 20, 0.12)',
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
                    backgroundColor: '#18181B',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
                    transition: 'all 0.3s ease',
                },
                elevation0: {
                    boxShadow: 'none',
                },
                elevation1: {
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
                },
                elevation2: {
                    boxShadow: 'rgba(0, 0, 0, 0.4) 0px 1px 4px',
                },
            },
        },
        // Drawer component overrides
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0E0E11',
                },
                modal: {
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(10, 10, 13, 0.85)',
                        backdropFilter: 'blur(8px)',
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
                        borderColor: 'rgba(128, 128, 128, 0.27)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(128, 128, 128, 0.4)',
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
                    backgroundColor: '#1E1E24',
                }
            }
        },
        // Input label component overrides
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: '"Rubik", sans-serif',
                    color: '#A1A1A1',
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
                    border: '1px solid rgba(128, 128, 128, 0.27)',
                    fontFamily: '"Rubik", sans-serif',
                    transition: 'all 0.3s ease-in-out',
                    '&.Mui-selected': {
                        backgroundColor: '#fe6f14',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#ff8e38',
                            transition: 'all 0.3s ease-in-out',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(254, 111, 20, 0.12)',
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
                        border: '1px solid rgba(128, 128, 128, 0.27)',
                        transition: 'all 0.3s ease-in-out',
                        '&:not(:first-of-type)': {
                            borderLeft: '1px solid rgba(128, 128, 128, 0.27)',
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
                    backgroundColor: '#18181B',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
                    border: '1px solid rgba(128, 128, 128, 0.27)',
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
                    backgroundColor: '#18181B',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.4) 0px 1px 4px',
                    border: '1px solid rgba(128, 128, 128, 0.27)',
                }
            }
        },
        // Dialog component overrides
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1A1A1F',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 8px',
                }
            }
        },
        // AppBar component overrides
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#18181B',
                    color: '#FFFFFF',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
                }
            }
        },
    },
};

// Create and export the dark theme
export const darkTheme = createTheme(themeOptions); 