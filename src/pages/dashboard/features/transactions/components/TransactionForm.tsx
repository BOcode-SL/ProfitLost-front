import { useState, useEffect } from 'react';
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

import { transactionService } from '../../../../../services/transaction.service';
import type { Category } from '../../../../../types/models/category.modelTypes';
import type { Transaction } from '../../../../../types/models/transaction.modelTypes';

interface TransactionFormProps {
    transaction?: Transaction;
    onSubmit: () => void;
    onClose: () => void;
    categories: Category[];
}

export default function TransactionForm({ transaction, onSubmit, onClose, categories }: TransactionFormProps) {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [isIncome, setIsIncome] = useState(false);

    // Cargar datos si estamos editando
    useEffect(() => {
        if (transaction) {
            const localDate = new Date(transaction.date);
            setDate(localDate.toISOString().slice(0, 16));
            setDescription(transaction.description);
            setAmount(Math.abs(transaction.amount).toString());
            setCategory(categories.find(cat => cat.name === transaction.category)?._id || '');
            setIsIncome(transaction.amount >= 0);
        }
    }, [transaction, categories]);

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
                localDate.getMinutes()
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
                            {transaction ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
} 