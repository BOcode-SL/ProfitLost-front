/**
 * Section Introduction Dialog Module
 * 
 * Provides contextual introductions to different dashboard sections.
 * 
 * Responsibilities:
 * - Displays welcome information for each section of the dashboard
 * - Presents section-specific features and instructions
 * - Creates a consistent onboarding experience across the application
 * - Adapts content based on the current language
 * - Provides animated transitions for better user experience
 * 
 * @module SectionIntroDialog
 */

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    useTheme,
    useMediaQuery,
    Divider,
    Slide,
    CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo, forwardRef } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Home, BarChart2, PieChart, CreditCard, Edit3 } from 'react-feather';

/**
 * Section Information Interface
 * 
 * Defines the structure for section introductions
 * 
 * @interface SectionInfo
 */
interface SectionInfo {
    /** Section title displayed in the dialog header */
    title: string;

    /** Array of content points to display as a list */
    content: string[];

    /** Icon identifier for the section */
    icon: string;
}

/**
 * Interface for SectionIntroDialog component props
 * 
 * @interface SectionIntroDialogProps
 */
interface SectionIntroDialogProps {
    /** Indicates whether the dialog is visible */
    open: boolean;

    /** Callback function to execute when the dialog is closed */
    onClose: () => void;

    /** The section for which the introduction is displayed */
    section: string;
}

/**
 * Dialog Title With Icon Component
 * 
 * Displays a section title with a themed icon in a circle
 * 
 * @param {Object} props - The component props
 * @param {string} props.title - The title text to display
 * @param {string} props.icon - The icon identifier
 * @returns {JSX.Element} The rendered component
 */
const DialogTitleWithIcon = ({ title, icon }: { title: string; icon: string }) => {
    return (
        <DialogTitle
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                pb: 1,
                pt: { xs: 3, sm: 2 },
                px: { xs: 3, sm: 3 }
            }}
        >
            <IconCircle icon={icon} />
            <Typography
                variant="h5"
                component="span"
                fontWeight="500"
                sx={{
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
            >
                {title}
            </Typography>
        </DialogTitle>
    );
};

/**
 * Get the appropriate icon component for a given section name
 * 
 * @param {string} iconName - The name of the icon to retrieve
 * @returns {JSX.Element} The icon component
 */
const getSectionIcon = (iconName: string) => {
    const iconProps = { size: 24, color: 'currentColor' };

    switch (iconName) {
        case 'home':
            return <Home {...iconProps} />;
        case 'bar-chart-2':
            return <BarChart2 {...iconProps} />;
        case 'pie-chart':
            return <PieChart {...iconProps} />;
        case 'credit-card':
            return <CreditCard {...iconProps} />;
        case 'edit-3':
            return <Edit3 {...iconProps} />;
        default:
            return <Home {...iconProps} />;
    }
};

/**
 * Icon Circle Component
 * 
 * Creates a circular badge with the section icon
 * 
 * @param {Object} props - The component props
 * @param {string} props.icon - The icon identifier
 * @returns {JSX.Element} The rendered icon circle
 */
const IconCircle = ({ icon }: { icon: string }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                minWidth: { xs: 40, sm: 48 },
                minHeight: { xs: 40, sm: 48 },
                borderRadius: '50%',
                backgroundColor: theme => theme.palette.primary.main,
                color: theme => theme.palette.primary.contrastText,
                overflow: 'hidden',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
                    borderColor: theme => theme.palette.primary.light,
                }
            }}
        >
            <Box
                sx={{
                    fontSize: { xs: 24, sm: 28 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                        '0%': {
                            opacity: 0.8,
                        },
                        '50%': {
                            opacity: 1,
                        },
                        '100%': {
                            opacity: 0.8,
                        }
                    }
                }}
            >
                {getSectionIcon(icon)}
            </Box>
        </Box>
    );
};

/**
 * Interface for AnimatedListItem component props
 * 
 * @interface AnimatedListItemProps
 */
interface AnimatedListItemProps {
    /** Content text to display */
    item: string;

    /** Index used for staggered animation */
    index: number;

    /** Whether the animation should be visible */
    isVisible: boolean;
}

/**
 * Animated List Item Component
 * 
 * Renders a list item with a staggered fade-in animation
 * 
 * @param {AnimatedListItemProps} props - The component props
 * @returns {JSX.Element} The rendered animated list item
 */
const AnimatedListItem = ({ item, index, isVisible }: AnimatedListItemProps) => {
    return (
        <ListItem
            key={index}
            sx={{
                py: 1,
                opacity: 0,
                transform: 'translateX(-10px)',
                animation: isVisible ? `fadeIn 0.5s ease forwards ${index * 0.1}s` : 'none',
                '@keyframes fadeIn': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateX(-10px)'
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateX(0)'
                    }
                },
                borderRadius: 1,
                '&:hover': {
                    backgroundColor: 'action.hover',
                }
            }}
        >
            <ListItemText
                primary={item}
                sx={{
                    '& .MuiListItemText-primary': {
                        fontSize: '1rem',
                        lineHeight: 1.5,
                        fontWeight: 400,
                        color: theme => theme.palette.text.primary
                    }
                }}
            />
        </ListItem>
    );
};

/**
 * useSectionInfo Hook
 * 
 * Retrieves introduction content for a specific section
 * from translation files
 * 
 * @param {string} section - The section key to get information for
 * @returns {SectionInfo} The section information
 */
const useSectionInfo = (section: string): SectionInfo => {
    const { t } = useTranslation();

    return useMemo(() => {
        const sectionMap: Record<string, SectionInfo> = {
            dashhome: {
                title: t('dashboard.dashhome.intro.title'),
                content: t('dashboard.dashhome.intro.content', { returnObjects: true }) as string[],
                icon: 'home'
            },
            annualReport: {
                title: t('dashboard.annualReport.intro.title'),
                content: t('dashboard.annualReport.intro.content', { returnObjects: true }) as string[],
                icon: 'bar_chart_4_bars'
            },
            transactions: {
                title: t('dashboard.transactions.intro.title'),
                content: t('dashboard.transactions.intro.content', { returnObjects: true }) as string[],
                icon: 'receipt_long'
            },
            accounts: {
                title: t('dashboard.accounts.intro.title'),
                content: t('dashboard.accounts.intro.content', { returnObjects: true }) as string[],
                icon: 'account_balance'
            },
            notes: {
                title: t('dashboard.notes.intro.title'),
                content: t('dashboard.notes.intro.content', { returnObjects: true }) as string[],
                icon: 'note_alt'
            }
        };

        return sectionMap[section] || { title: '', content: [], icon: '' };
    }, [section, t]);
};

/**
 * Dialog transition component for smooth animation
 * Uses a slide-up effect for better user experience
 * 
 * @param {TransitionProps & {children: React.ReactElement}} props - Transition properties
 * @param {React.Ref<unknown>} ref - Forwarded ref
 * @returns {JSX.Element} The transition component
 */
const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Section Introduction Dialog Component
 * 
 * Displays a welcome dialog for each section with:
 * - An animated list of feature descriptions
 * - Section icon and title
 * - Responsive design for different screen sizes
 * 
 * @param {SectionIntroDialogProps} props - The component props
 * @param {boolean} props.open - Whether the dialog is visible
 * @param {() => void} props.onClose - Function to call when the dialog is closed
 * @param {string} props.section - The section key to show information for
 * @returns {JSX.Element} The rendered SectionIntroDialog component
 */
export default function SectionIntroDialog({ open, onClose, section }: SectionIntroDialogProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const sectionInfo = useSectionInfo(section);

    /**
     * Processes content to ensure it's always an array
     * Handles cases where translation returns string or array
     */
    const contentArray = useMemo(() =>
        Array.isArray(sectionInfo.content) ? sectionInfo.content : [sectionInfo.content as string],
        [sectionInfo.content]
    );

    /**
     * Manages animation timing when dialog opens or closes
     * Adds a small delay before starting animations for better UX
     */
    useEffect(() => {
        let timeoutId: number;

        if (open) {
            timeoutId = setTimeout(() => {
                setIsVisible(true);
            }, 100);
        } else {
            setIsVisible(false);
            setLoading(false);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={fullScreen}
            TransitionComponent={Transition}
            sx={{
                '& .MuiDialog-container': {
                    alignItems: { xs: 'flex-end', sm: 'center' }
                },
                '& .MuiPaper-root': {
                    borderRadius: { xs: 0, sm: 2 },
                    height: { xs: 'calc(100dvh - 56px)', sm: 'auto' },
                    width: { xs: '100%', sm: '100%' },
                    maxHeight: { xs: 'calc(100dvh - 56px)', sm: '80dvh' },
                    m: { xs: 0, sm: 3 },
                    borderTopLeftRadius: { xs: 16, sm: 8 },
                    borderTopRightRadius: { xs: 16, sm: 8 },
                    borderBottomLeftRadius: { xs: 0, sm: 8 },
                    borderBottomRightRadius: { xs: 0, sm: 8 },
                    backgroundImage: 'none',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 8px',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: { xs: 'rgba(0, 0, 0, 0.7)', sm: 'rgba(0, 0, 0, 0.5)' },
                    backdropFilter: 'blur(5px)'
                }
            }}
        >
            <DialogTitleWithIcon title={sectionInfo.title} icon={sectionInfo.icon} />

            <Divider />

            <DialogContent
                sx={{
                    px: { xs: 3, sm: 3 },
                    py: 2,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(128, 128, 128, 0.3)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                }}
            >
                <List sx={{ pt: 1 }}>
                    {contentArray.map((item: string, index: number) => (
                        <AnimatedListItem
                            key={index}
                            item={item}
                            index={index}
                            isVisible={isVisible}
                        />
                    ))}
                </List>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Button
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            onClose();
                        }, 400);
                    }}
                    color="primary"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 4,
                        borderRadius: 2,
                        minWidth: '140px',
                        boxShadow: theme.shadows[1],
                        transition: 'all 0.3s ease-in-out',
                        position: 'relative'
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: 'primary.light',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px'
                            }}
                        />
                    ) : t('dashboard.common.understood')}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 