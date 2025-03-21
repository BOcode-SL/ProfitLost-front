import { useState, useEffect, forwardRef } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide, CircularProgress, Autocomplete, FormControlLabel, Switch } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../../../contexts/UserContext';
import { formatDate, prepareForBackend, utcToLocalString } from '../../../../../utils/dateUtils';

// Services
import { transactionService } from '../../../../../services/transaction.service';

// Types
import type { Category } from '../../../../../types/models/category';
import type { Transaction } from '../../../../../types/models/transaction';
import type { RecurrenceType } from '../../../../../types/models/transaction';

interface TransactionUpdateData {
    date: string;
    description: string;
    amount: number;
    category: string;
    isRecurrent?: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceEndDate?: string;
}

interface UpdateData {
    description: string;
    amount: number;
    category: string;
    date?: string;
    updateAll?: boolean;
}

// Interface for the TransactionForm component props
interface TransactionFormProps {
    transaction?: Transaction;
    onSubmit: () => void;
    onClose: () => void;
    categories: Category[];
}

// Transition component for dialog animations
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Helper function to calculate recurring dates based on start date, end date, and recurrence type
const calculateRecurringDates = (startDate: string, endDate: string, recurrenceType: RecurrenceType): Date[] => {
    // Create Date objects directly from the local dates from the form
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const dates: Date[] = [];
    // Create a copy to avoid modifying the original date
    const currentDate = new Date(start.getTime());

    while (currentDate <= end) {
        // Add a copy of the current date
        dates.push(new Date(currentDate.getTime()));

        switch (recurrenceType) {
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
        }
    }

    return dates;
};

// TransactionForm component
export default function TransactionForm({ transaction, onSubmit, onClose, categories }: TransactionFormProps) {
    const { t } = useTranslation();
    const { user } = useUser();

    const [date, setDate] = useState(() => {
        if (transaction) {
            // Convert UTC date to local format for the datetime-local input
            return utcToLocalString(transaction.date);
        }
        // For a new transaction, use the current local date and time
        const now = new Date();
        // Format the local date for the datetime-local input
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        // Format as YYYY-MM-DDTHH:mm:ss
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    });
    const [description, setDescription] = useState(transaction?.description || '');
    const [amount, setAmount] = useState(transaction ? Math.abs(transaction.amount).toString() : '');
    const [category, setCategory] = useState(transaction
        ? categories.find(cat => cat.name === transaction.category) || null
        : null
    );
    const [isIncome, setIsIncome] = useState(transaction ? transaction.amount >= 0 : false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [isRecurrent, setIsRecurrent] = useState(() => {
        return transaction?.isRecurrent || false;
    });
    const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(() => {
        return transaction?.recurrenceType || null;
    });
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(() => {
        if (transaction?.recurrenceEndDate) {
            return utcToLocalString(transaction.recurrenceEndDate).substring(0, 10);
        }
        return '';
    });
    const [editRecurrentDialog, setEditRecurrentDialog] = useState(false);
    const [transactionDataToUpdate, setTransactionDataToUpdate] = useState<TransactionUpdateData | null>(null);
    const [updateAllRecurrent, setUpdateAllRecurrent] = useState(false);

    // Effect to update the form with the transaction data when the transaction prop changes
    useEffect(() => {
        if (transaction) {
            // Convert UTC date to local format for the datetime-local input
            setDate(utcToLocalString(transaction.date));
            
            setDescription(transaction.description);
            setAmount(Math.abs(transaction.amount).toString());

            const foundCategory = categories.find(cat => cat.name === transaction.category);
            setCategory(foundCategory || null);

            setIsIncome(transaction.amount >= 0);
            setIsRecurrent(transaction.isRecurrent);
            setRecurrenceType(transaction.recurrenceType || null);
            
            if (transaction.recurrenceEndDate) {
                // Convert recurrence end date to local format
                setRecurrenceEndDate(utcToLocalString(transaction.recurrenceEndDate).substring(0, 10));
            }
        }
    }, [transaction, categories]);

    // Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !category) {
            toast.error(t('dashboard.transactions.form.errors.requiredFields'));
            return;
        }

        if (!transaction && isRecurrent && (!recurrenceType || !recurrenceEndDate)) {
            toast.error(t('dashboard.transactions.form.errors.recurrenceRequired'));
            return;
        }

        try {
            setIsSubmitting(true);
            
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                toast.error(t('dashboard.transactions.form.errors.invalidAmount'));
                setIsSubmitting(false);
                return;
            }

            const finalDescription = description.trim() || category.name || '';
            const localDate = new Date(date);
            // Convert local date to UTC for storage
            const utcDate = prepareForBackend(localDate);

            const transactionData: TransactionUpdateData = {
                date: utcDate,
                description: finalDescription,
                amount: numAmount * (isIncome ? 1 : -1),
                category: category._id
            };

            if (transaction?.isRecurrent) {
                setTransactionDataToUpdate(transactionData);
                setEditRecurrentDialog(true);
                setIsSubmitting(false);
                return;
            }

            if (transaction) {
                await transactionService.updateTransaction(transaction._id, transactionData);
                toast.success(t('dashboard.transactions.success.updated'));
            } else {
                if (isRecurrent) {
                    transactionData.isRecurrent = true;
                    transactionData.recurrenceType = recurrenceType;
                    // Ensure the recurrence end date is in ISO UTC format
                    // Create a Date object with the full date (adding the time)
                    const endDateWithTime = new Date(`${recurrenceEndDate}T23:59:59`);
                    transactionData.recurrenceEndDate = prepareForBackend(endDateWithTime);
                }
                await transactionService.createTransaction(transactionData);
                toast.success(t('dashboard.transactions.success.created'));
            }

            onSubmit();
            onClose();
        } catch (error) {
            console.error('An error occurred while submitting the transaction:', error);
            toast.error(t('dashboard.transactions.errors.updateError'));
            setIsSubmitting(false);
        }
    };

    // Handle the delete button click
    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    // Handle the confirmation of deletion
    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await transactionService.deleteTransaction(
                transaction!._id,
                transaction?.isRecurrent ? updateAllRecurrent : undefined
            );
            toast.success(t('dashboard.transactions.success.deleted'));
            onSubmit();
        } catch (error) {
            console.error('An error occurred while deleting the transaction:', error);
            toast.error(t('dashboard.transactions.errors.deleteError'));
        } finally {
            setIsDeleting(false);
            setDeleteDialog(false);
        }
    };

    // Handle the editing of recurrent transactions
    const handleEditRecurrent = async () => {
        if (!transaction || !transactionDataToUpdate) return;

        try {
            setIsSubmitting(true);
            
            const dataToUpdate: UpdateData = {
                description: transactionDataToUpdate.description,
                amount: transactionDataToUpdate.amount,
                category: transactionDataToUpdate.category
            };

            if (!updateAllRecurrent) {
                dataToUpdate.date = transactionDataToUpdate.date;
            }

            await transactionService.updateTransaction(
                transaction._id,
                { ...dataToUpdate, updateAll: updateAllRecurrent }
            );

            toast.success(t('dashboard.transactions.success.updated'));
            onSubmit();
            onClose();
        } catch (error) {
            console.error('An error occurred while updating the recurrent transaction:', error);
            toast.error(t('dashboard.transactions.errors.updateError'));
            setIsSubmitting(false);
        } finally {
            setEditRecurrentDialog(false);
        }
    };

    // Sort the categories alphabetically
    const sortedCategories = [...categories].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    // Calculate the recurring dates when all necessary data is available
    const recurringDates = date && recurrenceType && recurrenceEndDate
        ? calculateRecurringDates(date, recurrenceEndDate, recurrenceType)
        : [];

    // Delete confirmation dialog
    const DeleteDialog = () => (
        <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}
            TransitionComponent={Transition}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: '400px'
                    }
                }
            }}
        >
            {/* Title of the delete confirmation dialog */}
            <DialogTitle sx={{
                textAlign: 'center',
                pt: 3,
                pb: 1
            }}>
                {t('dashboard.transactions.form.delete.title')}
            </DialogTitle>
            {/* Content of the delete confirmation dialog */}
            <DialogContent sx={{
                textAlign: 'center',
                py: 2
            }}>
                <Typography>
                    {t('dashboard.transactions.form.delete.message')}{' '}
                    <Typography component="span" fontWeight="bold" color="primary">
                        {description || category?.name || t('dashboard.transactions.form.delete.thisTransaction')}
                    </Typography>
                    ?
                </Typography>
                {/* Conditional rendering for recurrent transaction warning */}
                {transaction?.isRecurrent && (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                            {t('dashboard.transactions.form.delete.recurrentWarning')}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={updateAllRecurrent}
                                    onChange={(e) => setUpdateAllRecurrent(e.target.checked)}
                                />
                            }
                            label={t('dashboard.transactions.form.delete.deleteAll')}
                        />
                    </>
                )}
            </DialogContent>
            {/* Actions at the bottom of the delete confirmation dialog */}
            <DialogActions sx={{
                justifyContent: 'center',
                gap: 2,
                p: 3
            }}>
                {/* Cancel button */}
                <Button
                    variant="outlined"
                    onClick={() => setDeleteDialog(false)}
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.common.cancel')}
                </Button>
                {/* Delete button */}
                <Button
                    variant="contained"
                    color="error"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    sx={{ width: '120px' }}
                >
                    {isDeleting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t('dashboard.common.delete')
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Recurrence fields component
    const RecurrenceFields = () => {
        const shouldShow = isRecurrent;

        if (!shouldShow) return null;

        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                {/* Recurrence type selection dropdown */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    {/* Label for the recurrence type selection */}
                    <InputLabel>{t('dashboard.transactions.form.fields.recurrenceType')}</InputLabel>
                    <Select
                        value={recurrenceType || ''}
                        onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                        label={t('dashboard.transactions.form.fields.recurrenceType')}
                    >
                        <MenuItem value="weekly">{t('dashboard.transactions.form.fields.weekly')}</MenuItem>
                        <MenuItem value="monthly">{t('dashboard.transactions.form.fields.monthly')}</MenuItem>
                        <MenuItem value="yearly">{t('dashboard.transactions.form.fields.yearly')}</MenuItem>
                    </Select>
                </FormControl>

                {/* Recurrence end date input field */}
                <TextField
                    type="date"
                    label={t('dashboard.transactions.form.fields.recurrenceEndDate')}
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />

                {/* Display the calculated recurring dates */}
                {recurringDates.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {t('dashboard.transactions.form.fields.recurrenceDates')}:
                        </Typography>
                        {recurringDates.map((date, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                            >
                                {formatDate(date, user)}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>
        );
    };

    // Recurrence switch component that allows the user to toggle recurrence
    const RecurrenceSwitch = ({ isEditing }: { isEditing: boolean }) => {
        // If editing and not recurrent, do not render anything
        if (isEditing && !isRecurrent) return null;

        return (
            // Paper component to contain the switch and label
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    pt: 1,
                    px: 2,
                    pb: isRecurrent ? 2 : 1,
                    borderRadius: 3,
                }}>
                {/* Box to layout the label and switch */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, width: '100%' }}>
                    {/* Label for the recurrence switch */}
                    <Typography>{t('dashboard.transactions.form.fields.isRecurrent')}</Typography>
                    {/* Switch to toggle recurrence */}
                    <Switch
                        checked={isRecurrent}
                        disabled={isEditing}
                        onChange={(e) => {
                            // Update the recurrence state based on switch value
                            setIsRecurrent(e.target.checked);
                            // If unchecked, reset recurrence type and end date
                            if (!e.target.checked) {
                                setRecurrenceType(null);
                                setRecurrenceEndDate('');
                            }
                        }}
                    />
                </Box>

                {/* Render recurrence fields if not editing and is recurrent */}
                {!isEditing && isRecurrent && <RecurrenceFields />}
            </Paper>
        );
    };

    // Edit recurrent dialog component
    const EditRecurrentDialog = () => (
        <Dialog
            open={editRecurrentDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setEditRecurrentDialog(false)}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: '400px'
                    }
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                {t('dashboard.transactions.form.editRecurrent.title')}
            </DialogTitle>
            <DialogContent sx={{
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <Typography>
                    {t('dashboard.transactions.form.editRecurrent.message')}
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={updateAllRecurrent}
                            onChange={(e) => setUpdateAllRecurrent(e.target.checked)}
                        />
                    }
                    label={t('dashboard.transactions.form.editRecurrent.updateAll')}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{
                justifyContent: 'center',
                gap: 2,
                p: 3
            }}>
                <Button
                    variant="outlined"
                    onClick={() => setEditRecurrentDialog(false)}
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.common.cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleEditRecurrent}
                    color="primary"
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.common.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Main container for the transaction form
    return (
        <Box sx={{ p: 3 }}>
            {/* Header with close button and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">{transaction ? t('dashboard.transactions.form.title.edit') : t('dashboard.transactions.form.title.new')}</Typography>
            </Box>

            {/* Form submission handler */}
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {/* Date input field */}
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

                    {/* Type selection (income/expense) */}
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

                    {/* Category selection with autocomplete */}
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

                    {/* Description input field */}
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

                    {/* Amount input field */}
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
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: 'decimal',
                                    pattern: '^[0-9]*([.,][0-9]{0,2})?$'
                                }
                            }}
                            value={amount}
                            onChange={(e) => {
                                // Replace commas with dots and validate the format
                                const value = e.target.value.replace(',', '.');
                                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    setAmount(value);
                                }
                            }}
                            fullWidth
                            required
                        />
                    </Paper>

                    {/* Recurrence switch component */}
                    <RecurrenceSwitch isEditing={!!transaction} />

                    {/* Buttons for form submission and cancellation */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        {transaction ? (
                            <>
                                <Button
                                    onClick={handleDeleteClick}
                                    variant="outlined"
                                    color="error"
                                    disabled={isDeleting || isSubmitting}
                                    fullWidth
                                >
                                    {t('dashboard.common.delete')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        t('dashboard.common.update')
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {t('dashboard.common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        t('dashboard.common.create')
                                    )}
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </form >

            {/* Dialogs for delete and edit recurrent transactions */}
            <DeleteDialog />
            <EditRecurrentDialog />
        </Box >
    );
} 