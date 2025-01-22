import { List, Box, Typography, useTheme, CircularProgress } from '@mui/material';

import type { Note } from '../../../../../types/models/note';

interface NoteListProps {
    notes: Note[];
    selectedNote: Note | null;
    onSelectNote: (note: Note) => void;
    isLoading: boolean;
}

export default function NoteList({
    notes,
    selectedNote,
    onSelectNote,
    isLoading
}: NoteListProps) {
    const theme = useTheme();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (notes.length === 0) {
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    No notes created
                </Typography>
            </Box>
        );
    }

    return (
        <List sx={{ mt: 2, overflow: 'auto', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {notes.map((note) => (
                <Box
                    key={note._id}
                    onClick={() => onSelectNote(note)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        mb: 1,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#f7f7f7',
                        borderRadius: 3,
                        borderLeft: selectedNote?._id === note._id ?
                            `4px solid ${theme.palette.primary.main}` :
                            '4px solid transparent'
                    }}>
                    <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                            fontWeight: selectedNote?._id === note._id ? 600 : 400
                        }}
                    >
                        {note.title || 'No title'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {note.content || ''}
                    </Typography>
                </Box>
            ))}
        </List>
    );
}