import { Box, Button, Paper } from '@mui/material';
import { useState } from 'react';
import type { Note } from '../../../../types/models/note';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

const mockNotes: Note[] = [
    {
        _id: '1',
        title: 'Monthly expenses',
        content: 'Remember to review your fixed monthly expenses: rent, electricity, water, internet...',
        user_id: 'user123',
        created_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z'
    },
    {
        _id: '2',
        title: 'Financial goals 2024',
        content: 'Save 20% of your monthly salary\nInvest in indexed funds\nReduce unnecessary expenses',
        user_id: 'user123',
        created_at: '2024-03-14T15:30:00Z',
        updated_at: '2024-03-14T15:30:00Z'
    },
    {
        _id: '3',
        title: 'Investment ideas',
        content: 'Research ETFs\nConsult with financial advisor\nReview current portfolio',
        user_id: 'user123',
        created_at: '2024-03-13T09:15:00Z',
        updated_at: '2024-03-13T09:15:00Z'
    }
];

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>(mockNotes);
    const [selectedNote, setSelectedNote] = useState<Note | null>(mockNotes[0]);

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
    };

    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            const updatedNote = { ...selectedNote, [key]: value };
            setSelectedNote(updatedNote);
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === selectedNote._id ? updatedNote : note
                )
            );
        }
    };

    const handleCreateNote = () => {
        const newNote: Note = {
            _id: `temp-${Date.now()}`,
            title: '',
            content: '',
            user_id: 'user123',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setSelectedNote(newNote);
    };

    return (
        <Box sx={{
            height: '100%',
        }}>
            <Box sx={{
                display: 'flex',
                gap: 2,
                height: '100%',
                '@media (max-width: 900px)': {
                    flexDirection: 'column'
                }
            }}>
                <Paper elevation={2} sx={{
                    p: 2,
                    borderRadius: 3,
                    width: {
                        xs: '100%',
                        md: '30%'
                    },
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCreateNote}
                        startIcon={<span className="material-symbols-rounded">add</span>}
                    >
                        Crear nota
                    </Button>
                    <NoteList
                        notes={notes}
                        selectedNote={selectedNote}
                        onSelectNote={handleSelectNote}
                        onDeleteNote={() => { }}
                        isLoading={false}
                    />
                </Paper>
                <Paper elevation={2} sx={{
                    p: 2,
                    flex: 1,
                    borderRadius: 3,
                }}>
                    <NoteEditor
                        note={selectedNote}
                        onChange={handleNoteChange}
                        onSave={() => { }}
                        onDelete={() => { }}
                    />
                </Paper>
            </Box>
        </Box>
    );
}