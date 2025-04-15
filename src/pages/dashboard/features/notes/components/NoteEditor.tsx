/**
 * NoteEditor Module
 * 
 * Provides a rich editing interface for note creation and modification with
 * real-time feedback and contextual action buttons.
 * 
 * Key Features:
 * - Real-time editing of note title and content with immediate state updates
 * - Save and delete actions with contextual button states and loading indicators
 * - Animated confirmation dialog for preventing accidental note deletion
 * - Empty state handling with appropriate user guidance
 * - Loading skeleton animation during data operations
 * - Responsive design adapting to different screen sizes and device types
 * - Accessible form controls with proper keyboard navigation
 * 
 * @module NoteEditor
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
import type { Note } from '../../../../../types/supabase/notes';

/**
 * Props interface for the NoteEditor component
 * 
 * @interface NoteEditorProps
 */
interface NoteEditorProps {
    /** The note object to edit, or null if no note is selected */
    note: Note | null;
    
    /** Callback function triggered when note content or title changes */
    onChange?: (key: keyof Note, value: string) => void;
    
    /** Callback function triggered when save button is clicked */
    onSave?: () => void;
    
    /** Callback function triggered when delete is confirmed */
    onDelete?: () => void;
    
    /** Indicates if a save or delete operation is in progress */
    isSaving?: boolean;
}

/**
 * Slide transition component for the delete confirmation dialog
 * Creates an animated entrance and exit for the dialog
 */
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;

    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * NoteEditor Component
 * 
 * Provides an interactive interface for editing note content with
 * title and body fields, plus action buttons for saving and deletion.
 * 
 * @param {NoteEditorProps} props - Component properties
 * @returns {JSX.Element} Rendered note editor component
 */
export default function NoteEditor({
    note,
    onChange,
    onSave,
    onDelete,
    isSaving = false
}: NoteEditorProps) {
    const { t } = useTranslation();

    /** State to control the visibility of delete confirmation dialog */
    const [deleteDialog, setDeleteDialog] = useState(false);

    /**
     * Opens the delete confirmation dialog
     * Prevents accidental deletion by requiring confirmation
     */
    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    /**
     * Render loading skeleton during save/delete operations
     * Provides visual feedback during asynchronous processes
     */
    if (isSaving) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* Title field skeleton with animation */}
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
                {/* Content field skeleton with animation */}
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{
                        borderRadius: 1,
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                />
                {/* Action buttons skeleton with animation */}
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

    /**
     * Render empty state when no note is selected
     * Provides user guidance for note selection
     */
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
            {/* Note editor form container */}
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* Note title input field */}
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

                {/* Note content textarea with auto-expanding rows */}
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    placeholder={t('dashboard.notes.form.fields.content.placeholder')}
                    value={note.content}
                    onChange={(e) => onChange?.('content', e.target.value)}
                    disabled={isSaving}
                />

                {/* Action buttons container with responsive layout */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
                    {/* Delete button with icon and responsive width */}
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
                    {/* Save button with loading indicator and responsive width */}
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

            {/* Delete confirmation dialog with animation */}
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
                {/* Dialog title with warning */}
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    {t('dashboard.notes.delete.title')}
                </DialogTitle>
                {/* Dialog content with explanation */}
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
                    {/* Cancel button to dismiss dialog */}
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