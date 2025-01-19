import { Box, Typography, TextField, Button } from '@mui/material';

import type { Note } from '../../../../../types/models/note';

interface NoteEditorProps {
    note: Note | null;
    onChange?: (key: keyof Note, value: string) => void;
    onSave?: () => void;
    onDelete?: () => void;
}

export default function NoteEditor({ note, onChange, onSave, onDelete }: NoteEditorProps) {

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
                />
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<span className="material-symbols-rounded">delete</span>}
                    onClick={onDelete}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<span className="material-symbols-rounded">save</span>}
                    onClick={onSave}
                >
                    Save
                </Button>
            </Box>

            <TextField
                multiline
                fullWidth
                minRows={4}
                placeholder="Note content"
                value={note.content}
                onChange={(e) => onChange?.('content', e.target.value)}
            />
        </Box>
    );
}