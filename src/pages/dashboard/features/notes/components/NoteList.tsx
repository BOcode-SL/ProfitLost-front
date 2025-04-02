/**
 * NoteList Component
 * 
 * Displays a scrollable list of notes with visual selection indicators.
 * Features include:
 * - Highlighting of currently selected note
 * - Note title and content preview with ellipsis for overflow
 * - Empty state handling when no notes exist
 * - Skeleton loading state during data fetching
 * - Responsive design to work within the sidebar layout
 * - Theme-aware styling for light and dark modes
 */
import { List, Box, Typography, useTheme, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Types
import type { Note } from '../../../../../types/models/note';

// Interface for the props of the NoteList component
interface NoteListProps {
    notes: Note[]; // Array of notes to display
    selectedNote: Note | null; // Currently selected note or null if none is selected
    onSelectNote: (note: Note) => void; // Callback function when a note is clicked
    isLoading: boolean; // Indicates if notes are being loaded
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

    // Display skeleton loaders while data is loading
    if (isLoading) {
        return (
            <List sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%'
            }}>
                {/* Generate multiple skeleton items to represent loading state */}
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
                        {/* Skeleton for note title */}
                        <Skeleton
                            variant="text"
                            width="60%"
                            height={24}
                            sx={{
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }}
                        />
                        {/* Skeleton for first line of content */}
                        <Skeleton
                            variant="text"
                            width="90%"
                            height={20}
                            sx={{
                                mt: 1,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }}
                        />
                        {/* Skeleton for second line of content */}
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
        );
    }

    // Display empty state message when no notes exist
    if (notes.length === 0) {
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    {t('dashboard.notes.list.noNotes')}
                </Typography>
            </Box>
        );
    }

    // Display list of notes
    return (
        <List sx={{
            mt: 2,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 200px)', // Limit height and enable scrolling
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%'
        }}>
            {/* Map through notes array to render each note */}
            {notes.map((note) => (
                // Individual note item with selection indicator
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
                        // Highlight selected note with colored left border
                        borderLeft: selectedNote?._id === note._id ?
                            `4px solid ${theme.palette.primary.main}` :
                            '4px solid transparent',
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ?
                                'rgba(255, 255, 255, 0.08)' :
                                'rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                    {/* Note content container with overflow handling */}
                    <Box sx={{ width: '100%', overflow: 'hidden' }}>
                        {/* Note title with ellipsis for overflow */}
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
                        {/* Note content preview with multi-line ellipsis */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2, // Limit to 2 lines
                                WebkitBoxOrient: 'vertical',
                                mt: 0.5,
                                lineHeight: '1.4em',
                                maxHeight: '2.8em' // Limit height to 2 lines
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