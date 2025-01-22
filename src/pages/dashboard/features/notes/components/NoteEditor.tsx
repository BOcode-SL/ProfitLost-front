import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

import type { Note } from '../../../../../types/models/note';

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
                    onClick={onDelete}
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
    );
}