import { useState, useEffect, forwardRef } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide, CircularProgress, Autocomplete } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-hot-toast';

import { transactionService } from '../../../../../services/transaction.service';
import type { Category } from '../../../../../types/models/category';
import type { Transaction } from '../../../../../types/models/transaction';

interface TransactionFormProps {
    transaction?: Transaction;
    onSubmit: () => void;
    onClose: () => void;
    categories: Category[];
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function TransactionForm({ transaction, onSubmit, onClose, categories }: TransactionFormProps) {
    const [date, setDate] = useState(transaction
        ? new Date(transaction.date).toISOString().slice(0, 19)
        : new Date().toISOString().slice(0, 19)
    );
    const [description, setDescription] = useState(transaction?.description || '');
    const [amount, setAmount] = useState(transaction ? Math.abs(transaction.amount).toString() : '');
    const [category, setCategory] = useState(transaction
        ? categories.find(cat => cat.name === transaction.category) || null
        : null
    );
    const [isIncome, setIsIncome] = useState(transaction ? transaction.amount >= 0 : false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        if (transaction) {
            const localDate = new Date(transaction.date);
            setDate(localDate.toISOString().slice(0, 19));
            setDescription(transaction.description);
            setAmount(Math.abs(transaction.amount).toString());
            setCategory(categories.find(cat => cat.name === transaction.category) || null);
            setIsIncome(transaction.amount >= 0);
        }
    }, [categories, transaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !category) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                toast.error('Invalid amount');
                return;
            }

            const finalDescription = description.trim() || category.name || '';

            const localDate = new Date(date);
            const utcDate = new Date(Date.UTC(
                localDate.getFullYear(),
                localDate.getMonth(),
                localDate.getDate(),
                localDate.getHours(),
                localDate.getMinutes(),
                localDate.getSeconds()
            ));

            const transactionData = {
                date: utcDate.toISOString(),
                description: finalDescription,
                amount: numAmount * (isIncome ? 1 : -1),
                category: category._id
            };

            if (transaction) {
                await transactionService.updateTransaction(transaction._id, transactionData);
                toast.success('Transaction updated successfully');
            } else {
                await transactionService.createTransaction(transactionData);
                toast.success('Transaction created successfully');
            }

            onSubmit();
        } catch (error) {
            console.error('Error details:', error);
            toast.error(transaction ? 'Failed to update transaction' : 'Failed to create transaction');
        }
    };

    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await transactionService.deleteTransaction(transaction!._id);
            toast.success('Transaction deleted successfully');
            onSubmit();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error('Failed to delete transaction');
        } finally {
            setIsDeleting(false);
            setDeleteDialog(false);
        }
    };

    // Ordenar categorías por nombre
    const sortedCategories = [...categories].sort((a, b) => 
        a.name.localeCompare(b.name)
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">{transaction ? 'Edit Transaction' : 'New Transaction'}</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 6 }}>

                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <TextField
                            size="small"
                            label="Date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            required
                        />
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <FormControl
                            fullWidth
                            size="small"
                            required
                        >
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={isIncome}
                                label="Type"
                                onChange={(e) => setIsIncome(e.target.value === 'true')}
                            >
                                <MenuItem value="false">Expense</MenuItem>
                                <MenuItem value="true">Income</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <Autocomplete
                            fullWidth
                            value={category}
                            onChange={(_, newValue) => setCategory(newValue)}
                            options={sortedCategories}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    label="Category"
                                    required
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        width: '100%' 
                                    }}>
                                        <Box 
                                            sx={{ 
                                                width: 8, 
                                                height: 8, 
                                                borderRadius: '50%', 
                                                bgcolor: option.color 
                                            }} 
                                        />
                                        {option.name}
                                    </Box>
                                </li>
                            )}
                        />
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>

                        <TextField
                            size="small"
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                        />
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <TextField
                            size="small"
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            required
                        />
                    </Paper>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        {transaction ? (
                            <>
                                <Button
                                    onClick={handleDeleteClick}
                                    variant="outlined"
                                    color="error"
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
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
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
                </Box>
            </form>

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
                    Delete Transaction
                </DialogTitle>
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        Are you sure you want to delete this transaction?
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
                        sx={{
                            width: '120px'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        sx={{
                            width: '120px'
                        }}
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