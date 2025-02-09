import { Box, Typography, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Types
import type { Note } from '../../../../../types/models/note';

// Interface for the props of the NoteEditor component
interface NoteEditorProps {
    note: Note | null; // The note object or null if no note is selected
    onChange?: (key: keyof Note, value: string) => void; // Optional callback for when a note property changes
    onSave?: () => void; // Optional callback for when the note is saved
    onDelete?: () => void; // Optional callback for when the note is deleted
    isSaving?: boolean; // Optional flag to indicate if the note is currently being saved
}

// Transition component
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;

    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// NoteEditor component
export default function NoteEditor({
    note,
    onChange,
    onSave,
    onDelete,
    isSaving = false

}: NoteEditorProps) {
    const { t } = useTranslation();

    const [deleteDialog, setDeleteDialog] = useState(false);

    // Handle the delete click
    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    // If the note is not found, show a message
    if (!note) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography color="text.secondary">
                    {t('dashboard.notes.list.selectNote')}
                </Typography>
            </Box>
        );
    }

    // Main return statement for the NoteEditor component
    return (
        <>
            {/* Container for the note editor */}
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* Title input field */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={t('dashboard.notes.form.fields.title.placeholder')}
                        value={note.title}
                        onChange={(e) => onChange?.('title', e.target.value)}
                        disabled={isSaving}
                        size="small"
                    />
                </Box>

                {/* Content input field */}
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    placeholder={t('dashboard.notes.form.fields.content.placeholder')}
                    value={note.content}
                    onChange={(e) => onChange?.('content', e.target.value)}
                    disabled={isSaving}
                />

                {/* Button container for delete and save actions */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
                    {/* Delete button */}
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<span className="material-symbols-rounded">delete</span>}
                        onClick={handleDeleteClick}
                        disabled={isSaving}
                        size="small"
                        sx={{
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        {t('dashboard.common.delete')}
                    </Button>
                    {/* Save button */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                            isSaving ?
                                <CircularProgress size={20} color="inherit" /> :
                                <span className="material-symbols-rounded">save</span>
                        }
                        onClick={onSave}
                        disabled={isSaving}
                        size="small"
                        sx={{
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        {t('dashboard.common.save')}
                    </Button>
                </Box>
            </Box>

            {/* Dialog for confirming deletion of the note */}
            <Dialog
                open={deleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setDeleteDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: '400px'
                    }
                }}
            >
                {/* Title of the delete confirmation dialog */}
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    {t('dashboard.notes.delete.title')}
                </DialogTitle>
                {/* Content of the delete confirmation dialog */}
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        {t('dashboard.notes.delete.confirmMessage')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('dashboard.notes.delete.warning')}
                    </Typography>
                </DialogContent>
                {/* Actions for the delete confirmation dialog */}
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    p: 3
                }}>
                    {/* Cancel button */}
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialog(false)}
                        sx={{ width: '120px' }}
                    >
                        {t('dashboard.common.cancel')}
                    </Button>
                    {/* Confirm delete button */}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDelete?.();
                            setDeleteDialog(false);
                        }}
                        disabled={isSaving}
                        sx={{ width: '120px' }}
                    >
                        {isSaving ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            t('dashboard.common.delete')
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}