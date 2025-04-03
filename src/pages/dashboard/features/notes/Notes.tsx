/**
 * Notes Component
 * 
 * Main notes management interface with features for creating, viewing, editing, and deleting notes.
 * Features include:
 * - Two-panel responsive layout (list and editor)
 * - Note creation with default title
 * - Real-time note editing
 * - Note deletion with confirmation
 * - Automatic selection of notes
 * - Loading states during data operations
 * - Error handling with user notifications
 */
import { Box, Button, Paper, CircularProgress } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

// Types
import type { Note } from '../../../../types/models/note';

// Services
import { noteService } from '../../../../services/note.service';

// Components
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

// Notes component
export default function Notes() {
    const { t } = useTranslation();

    // State management
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const isFirstRender = useRef(true);

    // Fetch notes on component mount
    useEffect(() => {
        const fetchNotes = async () => {
            if (!isFirstRender.current) return;
            isFirstRender.current = false;

            try {
                const response = await noteService.getAllNotes();
                if (response.success && response.data) {
                    // Handle both array and single object responses
                    const notesData = Array.isArray(response.data) ? response.data : [response.data];
                    setNotes(notesData);
                    // Automatically select the first note if available
                    if (notesData.length > 0) {
                        setSelectedNote(notesData[0]);
                    }
                }
            } catch {
                toast.error(t('dashboard.notes.errors.loadingError'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, [t]);

    // Set selected note when a note is clicked in the list
    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
    };

    // Update note in state when edited in the editor
    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            const updatedNote = { ...selectedNote, [key]: value };
            setSelectedNote(updatedNote);
        }
    };

    // Create a new note with default title
    const handleCreateNote = async () => {
        try {
            setIsSaving(true);
            const response = await noteService.createNote({
                title: t('dashboard.notes.form.title.new'),
                content: ''
            });

            if (response.success && response.data) {
                const newNote = response.data as Note;
                // Add new note to the beginning of the list
                setNotes(prevNotes => [newNote, ...prevNotes]);
                // Select the newly created note
                setSelectedNote(newNote);
            }
        } catch {
            toast.error(t('dashboard.notes.errors.createError'));
        } finally {
            setIsSaving(false);
        }
    };

    // Save changes to the currently selected note
    const handleSaveNote = async () => {
        if (!selectedNote) return;

        try {
            setIsSaving(true);

            const response = await noteService.updateNote(selectedNote._id, {
                title: selectedNote.title,
                content: selectedNote.content
            });

            if (response.success && response.data) {
                const updatedNote = response.data as Note;
                // Update the note in the notes list
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note._id === updatedNote._id ? updatedNote : note
                    )
                );
                // Update the selected note reference
                setSelectedNote(updatedNote);
                toast.success(t('dashboard.notes.success.updated'));
            } else {
                console.error('Error in response:', response);
                toast.error(response.message || t('dashboard.notes.errors.updateError'));
            }
        } catch (error) {
            console.error('Error saving note:', error);
            if (error && typeof error === 'object' && 'message' in error) {
                toast.error(error.message as string);
            } else {
                toast.error(t('dashboard.notes.errors.updateError'));
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Delete the currently selected note
    const handleDeleteNote = async () => {
        if (!selectedNote) return;

        try {
            setIsSaving(true);
            const response = await noteService.deleteNote(selectedNote._id);

            if (response.success) {
                // Remove the deleted note from the list
                setNotes(prevNotes => prevNotes.filter(note => note._id !== selectedNote._id));
                // Select the next available note or null if none left
                const remainingNotes = notes.filter(note => note._id !== selectedNote._id);
                setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
                toast.success(t('dashboard.notes.success.deleted'));
            }
        } catch {
            toast.error(t('dashboard.notes.errors.deleteError'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        // Main container with overflow handling
        <Box sx={{
            height: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
        }}>
            {/* Responsive layout container */}
            <Box sx={{
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    md: 'row'
                },
                gap: 2,
                height: '100%',
                width: '100%',
            }}>
                {/* Left sidebar with note list and create button */}
                <Paper elevation={3} sx={{
                    p: 2,
                    borderRadius: 3,
                    width: {
                        xs: '100%',
                        sm: '100%',
                        md: '300px'
                    },
                    minWidth: {
                        xs: '100%',
                        sm: '100%',
                        md: '250px'
                    },
                    maxWidth: {
                        xs: '100%',
                        sm: '100%',
                        md: '300px'
                    },
                    height: {
                        xs: 'auto',
                        md: '100%'
                    }
                }}>
                    {/* Create note button with loading indicator */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCreateNote}
                        disabled={isSaving}
                        startIcon={<AddIcon />}
                    >
                        {isSaving ? <CircularProgress size={24} /> : t('dashboard.notes.list.createNote')}
                    </Button>
                    {/* Note list component */}
                    <NoteList
                        notes={notes}
                        selectedNote={selectedNote}
                        onSelectNote={handleSelectNote}
                        isLoading={isLoading}
                    />
                </Paper>

                {/* Right panel with note editor */}
                <Paper elevation={3} sx={{
                    p: 2,
                    flex: 1,
                    borderRadius: 3,
                    minWidth: 0,
                    Width: '100%',
                    overflow: 'hidden'
                }}>
                    {/* Note editor component */}
                    <NoteEditor
                        note={selectedNote}
                        onChange={handleNoteChange}
                        onSave={handleSaveNote}
                        onDelete={handleDeleteNote}
                        isSaving={isSaving}
                    />
                </Paper>
            </Box>
        </Box>
    );
}