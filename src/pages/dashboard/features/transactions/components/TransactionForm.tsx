import { useState, useEffect, forwardRef } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide, CircularProgress, Autocomplete } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const [date, setDate] = useState(() => {
        if (transaction) {
            const txDate = new Date(transaction.date);
            return txDate.toISOString().slice(0, 19);
        }
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - offset);
        return localDate.toISOString().slice(0, 19);
    });
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
            const txDate = new Date(transaction.date);
            setDate(txDate.toISOString().slice(0, 19));
            setDescription(transaction.description);
            setAmount(Math.abs(transaction.amount).toString());
            setCategory(categories.find(cat => cat.name === transaction.category) || null);
            setIsIncome(transaction.amount >= 0);
        }
    }, [categories, transaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !category) {
            toast.error(t('dashboard.transactions.form.errors.requiredFields'));
            return;
        }

        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                toast.error(t('dashboard.transactions.form.errors.invalidAmount'));
                return;
            }

            const finalDescription = description.trim() || category.name || '';

            const localDate = new Date(date);
            const utcDate = new Date(
                localDate.getTime() - localDate.getTimezoneOffset() * 60000
            ).toISOString();

            const transactionData = {
                date: utcDate,
                description: finalDescription,
                amount: numAmount * (isIncome ? 1 : -1),
                category: category._id
            };

            if (transaction) {
                await transactionService.updateTransaction(transaction._id, transactionData);
                toast.success(t('dashboard.transactions.success.updated'));
            } else {
                await transactionService.createTransaction(transactionData);
                toast.success(t('dashboard.transactions.success.created'));
            }

            onSubmit();
        } catch (error) {
            console.error('Error details:', error);
            toast.error(transaction ? t('dashboard.transactions.errors.updateError') : t('dashboard.transactions.errors.createError'));
        }
    };

    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await transactionService.deleteTransaction(transaction!._id);
            toast.success(t('dashboard.transactions.success.deleted'));
            onSubmit();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error(t('dashboard.transactions.errors.deleteError'));
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
                <Typography variant="h6">{transaction ? t('dashboard.transactions.form.title.edit') : t('dashboard.transactions.form.title.new')}</Typography>
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
                            label={t('dashboard.transactions.form.fields.date')}
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
                            <InputLabel>{t('dashboard.transactions.form.fields.type')}</InputLabel>
                            <Select
                                value={isIncome}
                                label={t('dashboard.transactions.form.fields.type')}
                                onChange={(e) => setIsIncome(e.target.value === 'true')}
                            >
                                <MenuItem value="false">{t('dashboard.transactions.form.fields.expense')}</MenuItem>
                                <MenuItem value="true">{t('dashboard.transactions.form.fields.income')}</MenuItem>
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
                                    label={t('dashboard.transactions.form.fields.category')}
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
                            label={t('dashboard.transactions.form.fields.description')}
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
                            label={t('dashboard.transactions.form.fields.amount')}
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
                                    {t('dashboard.common.delete')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    {t('dashboard.common.update')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                    fullWidth
                                >
                                    {t('dashboard.common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    {t('dashboard.common.create')}
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
                    {t('dashboard.transactions.delete.title')}
                </DialogTitle>
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        {t('dashboard.transactions.delete.confirmMessage')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('dashboard.transactions.delete.warning')}
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
                        {t('dashboard.common.cancel')}
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
                            t('dashboard.common.delete')
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 