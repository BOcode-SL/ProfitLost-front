import { Box, Typography, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useState } from 'react';

import type { Note } from '../../../../../types/models/note';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface NoteEditorProps {
    note: Note | null;
    onChange?: (key: keyof Note, value: string) => void;
    onSave?: () => void;
    onDelete?: () => void;
    isSaving?: boolean;
}

export default function NoteEditor({
    note,
    onChange,
    onSave,
    onDelete,
    isSaving = false
}: NoteEditorProps) {
    const [deleteDialog, setDeleteDialog] = useState(false);

    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    if (!note) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography color="text.secondary">
                    Select a note to view its content
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Note title"
                        value={note.title}
                        onChange={(e) => onChange?.('title', e.target.value)}
                        disabled={isSaving}
                        size="small"
                    />
                </Box>

                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    placeholder="Note content"
                    value={note.content}
                    onChange={(e) => onChange?.('content', e.target.value)}
                    disabled={isSaving}
                />

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
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
                        Delete
                    </Button>
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
                        Save
                    </Button>
                </Box>
            </Box>

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
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    Delete Note
                </DialogTitle>
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        Are you sure you want to delete this note?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    p: 3
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialog(false)}
                        sx={{ width: '120px' }}
                    >
                        Cancel
                    </Button>
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
                            'Delete'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}