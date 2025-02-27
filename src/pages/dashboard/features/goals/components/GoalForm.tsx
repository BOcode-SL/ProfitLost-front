import { useState, forwardRef } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-hot-toast';

import { formatCurrency } from '../../../../../utils/currencyUtils';
import { formatDate } from '../../../../../utils/dateUtils';
import { useUser } from '../../../../../contexts/UserContext';
import type { Goal, GoalType } from '../../../../../types/models/goal';

interface GoalFormProps {
    goal?: Goal;
    onSubmit: (goalData: Omit<Goal, '_id' | 'user_id' | 'createdAt' | 'updatedAt'>) => void;
    onClose: () => void;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const goalTypes: GoalType[] = ['Saving', 'Investment', 'Goal', 'Debt'];

export default function GoalForm({ goal, onSubmit, onClose }: GoalFormProps) {
    const { user } = useUser();
    const [name, setName] = useState(goal?.name || '');
    const [type, setType] = useState<GoalType>(goal?.type || 'Saving');
    const [targetAmount, setTargetAmount] = useState(goal?.targetAmount.toString() || '');
    const [newAmount, setNewAmount] = useState('');
    const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().slice(0, 10));
    const [deadline, setDeadline] = useState(goal?.deadline
        ? new Date(goal.deadline).toISOString().slice(0, 10)
        : '');
    const [history, setHistory] = useState(goal?.history || []);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const handleAddToHistory = () => {
        if (!newAmount || !newEntryDate) {
            toast.error('Please fill all fields');
            return;
        }

        const amount = parseFloat(newAmount);
        if (isNaN(amount)) {
            toast.error('Invalid amount');
            return;
        }

        const newEntry = {
            date: new Date(newEntryDate).toISOString(),
            amount
        };

        const updatedHistory = [...history, newEntry].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setHistory(updatedHistory);
        setNewAmount('');
        setNewEntryDate(new Date().toISOString().slice(0, 10));
    };

    const handleRemoveFromHistory = (entryDate: string) => {
        setHistory(history.filter(entry => entry.date !== entryDate));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !targetAmount) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const numTargetAmount = parseFloat(targetAmount);
            if (isNaN(numTargetAmount)) {
                toast.error('Invalid target amount');
                return;
            }

            const currentAmount = history.reduce((sum, entry) => sum + entry.amount, 0);

            const goalData = {
                name: name.trim(),
                type,
                targetAmount: numTargetAmount,
                currentAmount,
                deadline: deadline ? new Date(deadline).toISOString() : undefined,
                history
            };

            onSubmit(goalData);
        } catch (error) {
            console.error('Error details:', error);
            toast.error(goal ? 'Failed to update goal' : 'Failed to create goal');
        }
    };

    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">
                    {goal ? 'Edit Goal' : 'New Goal'}
                </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <Paper elevation={3} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    borderRadius: 3,
                    mb: 2
                }}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                        required
                    />
                </Paper>

                <Paper elevation={3} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    borderRadius: 3,
                    mb: 2
                }}>
                    <FormControl fullWidth size="small" required>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value as GoalType)}
                        >
                            {goalTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                <Paper elevation={3} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    borderRadius: 3,
                    mb: 2
                }}>
                    <TextField
                        label="Target Amount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        fullWidth
                        size="small"
                        required
                    />
                </Paper>

                <Paper elevation={3} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    borderRadius: 3,
                    mb: 2
                }}>
                    <TextField
                        label="Deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Paper>

                <Box sx={{
                    display: 'flex', gap: 2, mb: goal ? 2 : 0,
                }}>
                    {goal ? (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                                fullWidth
                            >
                                Delete
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                fullWidth
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                            >
                                Create
                            </Button>
                        </>
                    )}
                </Box>

                {goal && (
                    <>
                        <Paper elevation={3} sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            mb: 2,
                            mt: 5
                        }}>
                            <Typography variant="subtitle2" color='primary.main' sx={{
                                p: 1,
                                pl: 2
                            }}>
                                New Entry
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                p: 2
                            }}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    value={newEntryDate}
                                    onChange={(e) => setNewEntryDate(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    label="Amount"
                                    type="number"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddToHistory}
                                    sx={{ minWidth: '100px' }}
                                    size="small"
                                >
                                    Add
                                </Button>
                            </Box>
                        </Paper>

                        <Paper elevation={3} sx={{
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}>
                            <Typography variant="subtitle2" color='primary.main' sx={{
                                p: 1,
                                pl: 2
                            }}>
                                History
                            </Typography>

                            <List dense sx={{ py: 0 }}>
                                {history.length === 0 ? (
                                    <ListItem sx={{ px: 2, py: 1 }}>
                                        <ListItemText
                                            primary="No entries yet"
                                            sx={{ textAlign: 'center', color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                ) : (
                                    history.map((entry, index) => (
                                        <Box key={entry.date}>
                                            <ListItem 
                                                sx={{ px: 2, py: 1 }}
                                                secondaryAction={
                                                    <IconButton 
                                                        edge="end" 
                                                        size="small"
                                                        onClick={() => handleRemoveFromHistory(entry.date)}
                                                    >
                                                        <span className="material-symbols-rounded">delete</span>
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={formatCurrency(entry.amount, user)}
                                                    secondary={formatDate(entry.date, user)}
                                                />
                                            </ListItem>
                                            {index < history.length - 1 && <Divider />}
                                        </Box>
                                    ))
                                )}
                            </List>
                        </Paper>
                    </>
                )}
            </Box>

            <Dialog
                open={deleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setDeleteDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    Delete Goal
                </DialogTitle>
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        Are you sure you want to delete this goal?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    p: 3
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialog(false)}
                        sx={{ width: '120px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setIsDeleting(true);
                            setDeleteDialog(false);
                            setIsDeleting(false);
                            onClose();
                        }}
                        disabled={isDeleting}
                        sx={{ width: '120px' }}
                    >
                        {isDeleting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}