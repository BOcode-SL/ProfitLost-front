/**
 * NoteList Module
 * 
 * Displays a scrollable, interactive list of user notes with visual selection indicators.
 * 
 * Key Features:
 * - Visual highlighting of currently selected note with color accent
 * - Truncated note previews with title and content ellipsis for better overview
 * - Empty state handling with appropriate user guidance
 * - Progressive loading skeleton animation during data retrieval
 * - Responsive design adapting to different screen sizes and sidebar layouts
 * - Theme-aware styling with automatic light/dark mode support
 * - Optimized scrolling for handling large collections of notes
 * 
 * @module NoteList
 */
import { List, Box, Typography, useTheme, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Types
import type { Note } from '../../../../../types/supabase/notes';

/**
 * Props interface for the NoteList component
 * 
 * @interface NoteListProps
 */
interface NoteListProps {
    /** Array of notes to display in the scrollable list */
    notes: Note[];
    
    /** Currently selected note or null if none is selected */
    selectedNote: Note | null;
    
    /** Callback function when a note is clicked to select it */
    onSelectNote: (note: Note) => void;
    
    /** Indicates if notes are currently being loaded */
    isLoading: boolean;
}

/**
 * NoteList Component
 * 
 * Renders a scrollable list of notes with selection indicators,
 * empty state handling, and loading animations.
 * 
 * @param {NoteListProps} props - Component properties
 * @returns {JSX.Element} Rendered note list component
 */
export default function NoteList({
    notes,
    selectedNote,
    onSelectNote,
    isLoading
}: NoteListProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    /**
     * Render loading skeleton during data retrieval
     * Provides visual feedback during the loading process
     */
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

    /**
     * Render empty state message when no notes exist
     * Provides user guidance when collection is empty
     */
    if (notes.length === 0) {
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    {t('dashboard.notes.list.noNotes')}
                </Typography>
            </Box>
        );
    }

    /**
     * Render interactive list of note items
     * Shows notes with selection highlighting and content preview
     */
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
            {/* Map through notes array to render each note item */}
            {notes.map((note) => (
                // Individual note item with selection indicator and hover states
                <Box
                    key={note.id}
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
                        borderLeft: selectedNote?.id === note.id ?
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
                                fontWeight: selectedNote?.id === note.id ? 600 : 400,
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