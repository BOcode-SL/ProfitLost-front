import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Box, useTheme, useMediaQuery, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';

// Utils
import { getIconComponent } from '../../../utils/sectionIconUtils';

// Types
interface SectionInfo {
    title: string;
    content: string[];
    icon: string;
}

interface SectionIntroDialogProps {
    open: boolean; // Indicates whether the dialog is visible
    onClose: () => void; // Callback function to execute when the dialog is closed
    section: string; // The section for which the introduction is displayed
}

// Component for the dialog title with an icon
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

// Component for the circular icon
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
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    fontSize: { xs: 24, sm: 28 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                }}
            >
                {getIconComponent(icon)}
            </Box>
        </Box>
    );
};

// Component for animated content items
const AnimatedListItem = ({ item, index, isVisible }: { item: string; index: number; isVisible: boolean }) => {
    return (
        <ListItem
            key={index}
            sx={{
                py: 1,
                opacity: 0,
                transform: 'translateY(10px)',
                animation: isVisible ? `fadeInUp 0.5s ease forwards ${index * 0.1}s` : 'none',
                '@keyframes fadeInUp': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                }
            }}
        >
            <ListItemText
                primary={item}
                sx={{
                    '& .MuiListItemText-primary': {
                        fontSize: '1rem',
                        lineHeight: 1.5
                    }
                }}
            />
        </ListItem>
    );
};

// Hook to retrieve section information
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

// Main component
export default function SectionIntroDialog({ open, onClose, section }: SectionIntroDialogProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isVisible, setIsVisible] = useState(false);

    const sectionInfo = useSectionInfo(section);

    const contentArray = useMemo(() =>
        Array.isArray(sectionInfo.content) ? sectionInfo.content : [sectionInfo.content as string],
        [sectionInfo.content]
    );

    // Manage the visibility of the animation
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (open) {
            timeoutId = setTimeout(() => {
                setIsVisible(true);
            }, 100);
        } else {
            setIsVisible(false);
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
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: { xs: 0, sm: 3 },
                    maxHeight: { xs: '100%', sm: '80vh' }
                }
            }}
        >
            <DialogTitleWithIcon title={sectionInfo.title} icon={sectionInfo.icon} />

            <Divider />

            <DialogContent sx={{ px: { xs: 3, sm: 3 }, py: 2 }}>
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

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={onClose}
                    color="primary"
                    size="large"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 4,
                        borderRadius: 2
                    }}
                >
                    {t('dashboard.common.understood')}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 