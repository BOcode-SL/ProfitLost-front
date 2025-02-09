import { List, Box, Typography, useTheme, Skeleton, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Types
import type { Note } from '../../../../../types/models/note';

// Interface for the props of the NoteList component
interface NoteListProps {
    notes: Note[]; // Array of notes
    selectedNote: Note | null; // Currently selected note or null if none is selected
    onSelectNote: (note: Note) => void; // Function to handle note selection
    isLoading: boolean; // Flag to indicate if notes are being loaded
}

// NoteList component
export default function NoteList({
    notes,
    selectedNote,
    onSelectNote,
    isLoading
}: NoteListProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    // If loading, show skeletons
    if (isLoading) {
        return (
            <Fade in timeout={500}>
                <List sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%'
                }}>
                    {[1, 2, 3, 4].map((index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: theme.palette.mode === 'dark' ?
                                    'rgba(255, 255, 255, 0.05)' :
                                    'rgba(0, 0, 0, 0.03)',
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width="60%"
                                height={24}
                                sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}
                            />
                            <Skeleton
                                variant="text"
                                width="90%"
                                height={20}
                                sx={{
                                    mt: 1,
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}
                            />
                            <Skeleton
                                variant="text"
                                width="40%"
                                height={20}
                                sx={{
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}
                            />
                        </Box>
                    ))}
                </List>
            </Fade>
        );
    }

    // If there are no notes, show a message
    if (notes.length === 0) {
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    {t('dashboard.notes.list.noNotes')}
                </Typography>
            </Box>
        );
    }

    // List container
    return (
        <List sx={{
            mt: 2,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%'
        }}>
            {/* Iterate over notes */}
            {notes.map((note) => (
                // Note item
                <Box
                    key={note._id}
                    onClick={() => onSelectNote(note)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        minWidth: 0,
                        maxWidth: '100%',
                        mb: 1,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: theme.palette.mode === 'dark' ?
                            'rgba(255, 255, 255, 0.05)' :
                            'rgba(0, 0, 0, 0.03)',
                        borderRadius: 3,
                        borderLeft: selectedNote?._id === note._id ?
                            `4px solid ${theme.palette.primary.main}` :
                            '4px solid transparent',
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ?
                                'rgba(255, 255, 255, 0.08)' :
                                'rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                    {/* Note content */}
                    <Box sx={{ width: '100%', overflow: 'hidden' }}>
                        {/* Note title */}
                        <Typography
                            variant="subtitle1"
                            noWrap
                            sx={{
                                fontWeight: selectedNote?._id === note._id ? 600 : 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: theme.palette.text.primary
                            }}
                        >
                            {note.title || t('dashboard.notes.list.noTitle')}
                        </Typography>
                        {/* Note body */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mt: 0.5,
                                lineHeight: '1.4em',
                                maxHeight: '2.8em'
                            }}
                        >
                            {note.content || ''}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </List>
    );
}