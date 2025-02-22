import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Define the props for the SectionIntroDialog component
interface SectionIntroDialogProps {
    open: boolean; // Controls the visibility of the dialog
    onClose: () => void; // Function to call when the dialog is closed
    section: string; // The section for which the introduction is displayed
}

// Main functional component for the SectionIntroDialog
export default function SectionIntroDialog({ open, onClose, section }: SectionIntroDialogProps) {
    const { t } = useTranslation();

    // Function to retrieve content based on the section
    const getSectionContent = (section: string) => {
        return {
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
        }[section] || { title: '', content: [], icon: '' };
    };

    const sectionInfo = getSectionContent(section);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    pb: 1
                }}
            >
                <span className="material-symbols-rounded" style={{ fontSize: 28 }}>
                    {sectionInfo.icon}
                </span>
                <Typography variant="h6" component="span">
                    {sectionInfo.title}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <List>
                    {Array.isArray(sectionInfo.content) ? sectionInfo.content.map((item: string, index: number) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText
                                primary={item}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontSize: '0.95rem'
                                    }
                                }}
                            />
                        </ListItem>
                    )) : (
                        <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                                primary={sectionInfo.content as string}
                            />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    {t('dashboard.common.understood')}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 