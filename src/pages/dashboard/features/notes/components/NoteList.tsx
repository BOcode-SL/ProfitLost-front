import { List, Box, Typography, useTheme } from '@mui/material';
import type { Note } from '../../../../../types/models/note';

interface NoteListProps {
    notes: Note[];
    selectedNote: Note | null;
    onSelectNote: (note: Note) => void;
    onDeleteNote?: (note: Note) => void;
    isLoading: boolean;
}

export default function NoteList({
    notes,
    selectedNote,
    onSelectNote
}: NoteListProps) {
    const theme = useTheme();

    return (
        <List sx={{ mt: 2, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                        {note.content || 'No content'}
                    </Typography>
                </Box>
            ))}
        </List>
    );
}