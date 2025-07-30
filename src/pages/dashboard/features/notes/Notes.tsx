/**
 * Notes Module
 *
 * Comprehensive note management system with dual-panel interface for creating,
 * viewing, editing, and organizing personal notes.
 *
 * Key Features:
 * - Two-panel responsive layout (list and editor) with adaptive design
 * - Note creation with default localized title
 * - Real-time note editing with automatic state synchronization
 * - Note deletion with confirmation dialog for prevention of data loss
 * - Intelligent note selection with automatic fallback
 * - Loading states with visual feedback during asynchronous operations
 * - Error handling with user-friendly notifications
 *
 * @module Notes
 */
import { Box, Button, Paper, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";

// Contexts
import { useUser } from "../../../../contexts/UserContext";

// Types
import type { Note } from "../../../../types/supabase/notes";

// Services
import { noteService } from "../../../../services/note.service";

// Utils
import { hasActiveSubscription } from "../../../../utils/subscriptionUtils";

// Components
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";

/**
 * Notes Component
 *
 * Main container for the notes management feature. Handles data fetching,
 * note selection, creation, editing, and deletion operations.
 *
 * @returns {JSX.Element} The rendered notes management interface
 */
export default function Notes() {
  const { t } = useTranslation();
  const { userSubscription } = useUser();

  /**
   * State Management
   */
  /** Collection of all user notes, sorted by last modified date */
  const [notes, setNotes] = useState<Note[]>([]);

  /** Currently active note for viewing/editing, or null if none selected */
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  /** Loading state for initial data fetch operation */
  const [isLoading, setIsLoading] = useState(true);

  /** Saving state for create/update/delete operations */
  const [isSaving, setIsSaving] = useState(false);

  /** Ref to prevent duplicate fetch calls on re-renders */
  const isFirstRender = useRef(true);

  /**
   * Fetch user's notes on component mount
   * Uses a ref to ensure the fetch only happens once
   */
  useEffect(() => {
    const fetchNotes = async () => {
      if (!isFirstRender.current) return;
      isFirstRender.current = false;

      try {
        const response = await noteService.getAllNotes();
        if (response.success && response.data) {
          // Handle both array and single object responses
          const notesData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setNotes(notesData);
          // Automatically select the first note if available
          if (notesData.length > 0) {
            setSelectedNote(notesData[0]);
          }
        }
      } catch {
        toast.error(t("dashboard.notes.errors.loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [t]);

  /**
   * Updates the selected note when a note is clicked in the list
   *
   * @param {Note} note - The note to be selected
   */
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  /**
   * Updates a specific field of the selected note in local state
   * Enables real-time editing without immediate server updates
   *
   * @param {keyof Note} key - The property of the note to update
   * @param {string} value - The new value for the specified property
   */
  const handleNoteChange = (key: keyof Note, value: string) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, [key]: value };
      setSelectedNote(updatedNote);
    }
  };

  /**
   * Creates a new note with default title and empty content
   * Adds the new note to the beginning of the list and selects it
   */
  const handleCreateNote = async () => {
    try {
      setIsSaving(true);
      const response = await noteService.createNote({
        title: t("dashboard.notes.form.title.new"),
        content: "",
      });

      if (response.success && response.data) {
        const newNote = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        // Add new note to the beginning of the list
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        // Select the newly created note
        setSelectedNote(newNote);
      }
    } catch {
      toast.error(t("dashboard.notes.errors.createError"));
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Persists changes to the currently selected note to the server
   * Updates the notes list and the selected note with the server response
   */
  const handleSaveNote = async () => {
    if (!selectedNote) return;

    try {
      setIsSaving(true);

      const response = await noteService.updateNote(selectedNote.id, {
        title: selectedNote.title,
        content: selectedNote.content,
      });

      if (response.success && response.data) {
        const updatedNote = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        // Update the note in the notes list
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          )
        );
        // Update the selected note reference
        setSelectedNote(updatedNote);
        toast.success(t("dashboard.notes.success.updated"));
      } else {
        console.error("Error in response:", response);
        toast.error(
          response.message || t("dashboard.notes.errors.updateError")
        );
      }
    } catch (error) {
      console.error("Error saving note:", error);
      if (error && typeof error === "object" && "message" in error) {
        toast.error(error.message as string);
      } else {
        toast.error(t("dashboard.notes.errors.updateError"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Deletes the currently selected note after confirmation
   * Selects the next available note after deletion
   */
  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    try {
      setIsSaving(true);
      const response = await noteService.deleteNote(selectedNote.id);

      if (response.success) {
        // Remove the deleted note from the list
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== selectedNote.id)
        );
        // Select the next available note or null if none left
        const remainingNotes = notes.filter(
          (note) => note.id !== selectedNote.id
        );
        setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
        toast.success(t("dashboard.notes.success.deleted"));
      }
    } catch {
      toast.error(t("dashboard.notes.errors.deleteError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Main container with overflow handling
    <Box
      sx={{
        height: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Responsive layout container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          height: "100%",
          width: "100%",
        }}
      >
        {/* Left sidebar with note list and create button */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 3,
            width: {
              xs: "100%",
              sm: "100%",
              md: "300px",
            },
            minWidth: {
              xs: "100%",
              sm: "100%",
              md: "250px",
            },
            maxWidth: {
              xs: "100%",
              sm: "100%",
              md: "300px",
            },
            height: {
              xs: "auto",
              md: "100%",
            },
          }}
        >
          {/* Create note button with loading indicator */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateNote}
            disabled={isSaving || hasActiveSubscription(userSubscription)}
            startIcon={<AddIcon />}
          >
            {isSaving ? (
              <CircularProgress size={24} />
            ) : (
              t("dashboard.notes.list.createNote")
            )}
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
        <Paper
          elevation={3}
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 3,
            minWidth: 0,
            Width: "100%",
            overflow: "hidden",
          }}
        >
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
