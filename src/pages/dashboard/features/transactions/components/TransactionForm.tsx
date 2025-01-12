import { useState, useEffect, forwardRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { toast } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';

import { transactionService } from '../../../../../services/transaction.service';
import type { Category } from '../../../../../types/models/category.modelTypes';
import type { Transaction } from '../../../../../types/models/transaction.modelTypes';

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
        ? new Date(transaction.date).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16)
    );
    const [description, setDescription] = useState(transaction?.description || '');
    const [amount, setAmount] = useState(transaction ? Math.abs(transaction.amount).toString() : '');
    const [category, setCategory] = useState(transaction 
        ? (categories.find(cat => cat.name === transaction.category)?._id || '')
        : ''
    );
    const [isIncome, setIsIncome] = useState(transaction ? transaction.amount >= 0 : false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        if (transaction) {
            const localDate = new Date(transaction.date);
            setDate(localDate.toISOString().slice(0, 16));
            setDescription(transaction.description);
            setAmount(Math.abs(transaction.amount).toString());
            setCategory(categories.find(cat => cat.name === transaction.category)?._id || '');
            setIsIncome(transaction.amount >= 0);
        }
    }, [categories, transaction, transaction?._id]); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim() || !amount || !category) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                toast.error('Invalid amount');
                return;
            }

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
                description: description.trim(),
                amount: numAmount * (isIncome ? 1 : -1),
                category
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
                        <FormControl
                            fullWidth
                            required
                            size="small"
                        >
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
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

                        <TextField
                            size="small"
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                                    sx={{ width: '100%', height: '45px' }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: '100%', height: '45px' }}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                    sx={{ width: '100%', height: '45px' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: '100%', height: '45px' }}
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
                            width: '120px',
                            height: '45px'
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
                            width: '120px',
                            height: '45px'
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