/**
 * NoteEditor Component
 * 
 * Provides an interface for editing note content with title and body fields.
 * Features include:
 * - Real-time editing of note title and content
 * - Save and delete actions with proper button states
 * - Confirmation dialog for note deletion
 * - Empty state handling when no note is selected
 * - Loading skeleton state during save operations
 * - Responsive design for different screen sizes
 */
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Skeleton
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

// Types
import type { Note } from '../../../../../types/models/note';

// Interface for the props of the NoteEditor component
interface NoteEditorProps {
    note: Note | null; // The note object to edit, or null if no note is selected
    onChange?: (key: keyof Note, value: string) => void; // Callback when note content changes
    onSave?: () => void; // Callback when save button is clicked
    onDelete?: () => void; // Callback when delete is confirmed
    isSaving?: boolean; // Indicates if a save/delete operation is in progress
}

// Slide transition component for the delete confirmation dialog
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;

    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NoteEditor({
    note,
    onChange,
    onSave,
    onDelete,
    isSaving = false
}: NoteEditorProps) {
    const { t } = useTranslation();

    // State to control the delete confirmation dialog
    const [deleteDialog, setDeleteDialog] = useState(false);

    // Open delete confirmation dialog
    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    // Display skeleton loaders during save operations
    if (isSaving) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* Title field skeleton */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={40}
                        sx={{
                            borderRadius: 1,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </Box>
                {/* Content field skeleton */}
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{
                        borderRadius: 1,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                {/* Action buttons skeleton */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
                    <Skeleton
                        variant="rectangular"
                        width={100}
                        height={36}
                        sx={{
                            borderRadius: 1,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                    <Skeleton
                        variant="rectangular"
                        width={100}
                        height={36}
                        sx={{
                            borderRadius: 1,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </Box>
            </Box>
        );
    }

    // Empty state when no note is selected
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

    return (
        <>
            {/* Note editor form */}
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* Note title input */}
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

                {/* Note content textarea */}
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    placeholder={t('dashboard.notes.form.fields.content.placeholder')}
                    value={note.content}
                    onChange={(e) => onChange?.('content', e.target.value)}
                    disabled={isSaving}
                />

                {/* Action buttons container */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
                    {/* Delete button */}
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={handleDeleteClick}
                        disabled={isSaving}
                        size="small"
                        sx={{
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        {t('dashboard.common.delete')}
                    </Button>
                    {/* Save button with loading indicator */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                            isSaving ?
                                <CircularProgress size={20} color="inherit" /> :
                                <SaveOutlinedIcon />
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

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setDeleteDialog(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            width: '90%',
                            maxWidth: '400px'
                        }
                    }
                }}
            >
                {/* Dialog title */}
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    {t('dashboard.notes.delete.title')}
                </DialogTitle>
                {/* Dialog message */}
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
                {/* Dialog action buttons */}
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
                    {/* Confirm delete button with loading indicator */}
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