import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
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
                content: t('dashboard.dashhome.intro.content'),
                icon: 'home'
            },
            annualReport: {
                title: t('dashboard.annualReport.intro.title'),
                content: t('dashboard.annualReport.intro.content'),
                icon: 'bar_chart_4_bars'
            },
            transactions: {
                title: t('dashboard.transactions.intro.title'),
                content: t('dashboard.transactions.intro.content'),
                icon: 'receipt_long'
            },
            accounts: {
                title: t('dashboard.accounts.intro.title'),
                content: t('dashboard.accounts.intro.content'),
                icon: 'account_balance'
            },
            notes: {
                title: t('dashboard.notes.intro.title'),
                content: t('dashboard.notes.intro.content'),
                icon: 'note_alt'
            }
        }[section] || { title: '', content: '', icon: '' };
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
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <span className="material-symbols-rounded">{sectionInfo.icon}</span>
                {sectionInfo.title}
            </DialogTitle>
            <DialogContent>
                <Typography>{sectionInfo.content}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('dashboard.common.understood')}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 