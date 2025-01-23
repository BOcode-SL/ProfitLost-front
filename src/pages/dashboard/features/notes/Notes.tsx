import { Box, Button, Paper, CircularProgress } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

import type { Note } from '../../../../types/models/note';
import { noteService } from '../../../../services/note.service';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchNotes = async () => {
            if (!isFirstRender.current) return;
            isFirstRender.current = false;

            try {
                const response = await noteService.getAllNotes();
                if (response.success && response.data) {
                    const notesData = Array.isArray(response.data) ? response.data : [response.data];
                    setNotes(notesData);
                    if (notesData.length > 0) {
                        setSelectedNote(notesData[0]);
                    }
                }
            } catch {
                toast.error('Error loading notes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
    };

    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            const updatedNote = { ...selectedNote, [key]: value };
            setSelectedNote(updatedNote);
        }
    };

    const handleCreateNote = async () => {
        try {
            setIsSaving(true);
            const response = await noteService.createNote({
                title: 'New Note',
                content: ''
            });

            if (response.success && response.data) {
                const newNote = response.data as Note;
                setNotes(prevNotes => [newNote, ...prevNotes]);
                setSelectedNote(newNote);
            }
        } catch {
            toast.error('Error creating note');
        } finally {
            setIsSaving(false);
        }
    };

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
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note._id === updatedNote._id ? updatedNote : note
                    )
                );
                setSelectedNote(updatedNote);
                toast.success('Note saved successfully');
            } else {
                console.error('Error in response:', response);
                toast.error(response.message || 'Error saving note');
            }
        } catch (error) {
            console.error('Error saving note:', error);
            if (error && typeof error === 'object' && 'message' in error) {
                toast.error(error.message as string);
            } else {
                toast.error('Error saving note');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!selectedNote) return;

        try {
            setIsSaving(true);
            const response = await noteService.deleteNote(selectedNote._id);

            if (response.success) {
                setNotes(prevNotes => prevNotes.filter(note => note._id !== selectedNote._id));
                const remainingNotes = notes.filter(note => note._id !== selectedNote._id);
                setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
                toast.success('Note deleted successfully');
            }
        } catch {
            toast.error('Error deleting note');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{
            height: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
        }}>
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
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCreateNote}
                        disabled={isSaving}
                        startIcon={<span className="material-symbols-rounded">add</span>}
                    >
                        {isSaving ? <CircularProgress size={24} /> : 'Create note'}
                    </Button>
                    <NoteList
                        notes={notes}
                        selectedNote={selectedNote}
                        onSelectNote={handleSelectNote}
                        isLoading={isLoading}
                    />
                </Paper>
                
                <Paper elevation={3} sx={{
                    p: 2,
                    flex: 1,
                    borderRadius: 3,
                    minWidth: 0,
                    Width: '100%',
                    overflow: 'hidden'
                }}>
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